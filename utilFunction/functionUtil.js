
const mime = require('mime');
const fs = require('fs');

const jwt = require("jsonwebtoken");

function uploadPhoto(res,photo) {
    //upload image
    let path = "";

    let imgName = Date.now();
    path = './upload/' + imgName;
    var matches = photo.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/),
        response = {};

    if (matches.length !== 3) {
        return res
            .status(400)
            .send({ status: 400, message: new Error("Invalid input string") });
    }

    response.type = matches[1];
    response.data = Buffer.from(matches[2], "base64");
    let decodedImg = response;
    let imageBuffer = decodedImg.data;
    let type = decodedImg.type;
    let extension = mime.getExtension(type);

    path = path + "." + extension;
    if (extension !== "png" && extension !== "jpeg") {
        return res.status(404).json({
            status: 404,
            message: "the image should be in format PNG or JPEG"
        });
    }
    try {
        fs.writeFileSync(path, imageBuffer, "utf8");
        return path
    } catch (e) {
        res.status(400).json({ status: 400, message: e.message })
    }
}
function verifToken(req,res){
    var authorization = req.headers.authorization.split(' ')[1], decoded
    try {
      decoded = jwt.verify(authorization, 'RANDOM_TOKEN_SECRET')
      return decoded
    }
    catch (error) {
      return res.status(401).send({ status: 401, message: 'unauthorized!' })
    }
}




module.exports={uploadPhoto,verifToken}