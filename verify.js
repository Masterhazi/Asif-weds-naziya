import crypto from "crypto";
import fs from "fs";

const EXPECTED_HASH =
"dbe565918d38ea7aec5c5da43485388a26e18ff8a6babe39df5e41e5e4c3d991";

const fingerprint = process.env.BUILD_FINGERPRINT || "";

const actualHash = crypto
    .createHash("sha256")
    .update(fingerprint)
    .digest("hex");

if (actualHash !== EXPECTED_HASH) {

    console.log("🧐 Unauthorized deployment detected.");
    console.log("Deploying imposter website...");

    fs.copyFileSync("landing.html", "index.html");

} else {

    console.log("✅ Official deployment verified.");

}