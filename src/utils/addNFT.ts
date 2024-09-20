import { Connection, Keypair, PublicKey, clusterApiUrl } from "@solana/web3.js";
import { Metaplex, keypairIdentity, irysStorage, toMetaplexFile } from "@metaplex-foundation/js";
import fs from 'fs';
import path from 'path';
const bs58 = require('bs58');

const GAME_WALLET_PRIVATE_KEY = process.env.GAME_WALLET_PRIVATE_KEY;
const payerKeypair = Keypair.fromSecretKey(bs58.decode(GAME_WALLET_PRIVATE_KEY));

export async function mintNFTToPublicKey(newOwnerPublicKey: string, nftImagePath: string, nftName: string, nftDescription: string): Promise<boolean> {
  const NETWORK = "https://api.devnet.solana.com";
  const connection = new Connection(NETWORK);

  const metaplex = Metaplex.make(connection)
    .use(keypairIdentity(payerKeypair))
    .use(irysStorage({
      address: 'https://devnet.bundlr.network',
      providerUrl: 'https://api.devnet.solana.com',
      timeout: 60000,
    }));

  const absoluteImagePath = path.resolve(nftImagePath);

  const imageBuffer = fs.readFileSync(absoluteImagePath);

  const fileName = nftName;
  const metaplexFile = toMetaplexFile(imageBuffer, fileName);

  try {
    console.log('Uploading image...');
    const imageUri = await metaplex.storage().upload(metaplexFile);
    console.log('Image uploaded successfully:', imageUri);

    console.log('Creating metadata...');
    const { uri: metadataUri } = await metaplex.nfts().uploadMetadata({
      name: nftName,
      description: nftDescription,
      image: imageUri,
      attributes: [
        { trait_type: "Created By", value: "Solabule" }
      ],
      properties: {
        files: [{ uri: imageUri, type: "image/png" }]
      }
    });
    console.log('Metadata created successfully:', metadataUri);

    const newOwnerAddress = new PublicKey(newOwnerPublicKey);

    console.log('Minting NFT...');
    const { nft } = await metaplex.nfts().create({
      uri: metadataUri,
      name: nftName,
      sellerFeeBasisPoints: 500, // 5% royalty
      symbol: "SLBNFT", // Add a symbol for your NFT
      tokenOwner: newOwnerAddress,
      creators: [{ address: payerKeypair.publicKey, share: 100 }],
      isMutable: true
    });

    console.log(`NFT minted successfully!`);
    console.log(`Owner: ${newOwnerPublicKey}`);
    console.log(`NFT Address: ${nft.address.toString()}`);
    console.log(`Metadata Address: ${nft.metadataAddress.toString()}`);
    return true;
  } catch (error) {
    console.error('Error minting NFT:', error);
    return false;
  }
}
