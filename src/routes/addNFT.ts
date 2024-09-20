import { mintNFTToPublicKey } from "../utils/addNFT";

const express = require('express');
const router = express.Router();

router.get("/addNFT", async (req: any, res: any) => {
    const _test = req.body;
    const succ = await mintNFTToPublicKey(
      '6264vVvtWg8CqBRegBt83ttcPPK61LurXNs7cqF56Gf5',
      '../nfts/5-gameswin.png',
      '5 game win NFT',
      'This is a special NFT for winning 5 games!!'
    );

    if(succ) {
        res.status(200).json({
            message: "added NFT!!"
        });
    } else {
        res.status(400).json({
            message: "Failed to add NFT!!"
        });
    }
});

module.exports = router;
