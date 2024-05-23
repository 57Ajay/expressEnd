import { Router } from "express";

const router = Router();

router.get("/api/products", (req, res) => {
    console.log(req.headers.cookie);
    console.log(req.cookies);
    console.log(req.signedCookies);
    if (req.signedCookies.hello && req.signedCookies.hello === "world"){
        res.json({
            msg: "Products",
            data: "Here is the list of products",
            products: ["pasta", "pizza", "burger"],
          });
    }
    else res.status(401).json({msg: "Unauthorized"});
});


export default router;