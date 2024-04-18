const express = require('express');
const fs = require('fs');
const app = express();
const cors = require('cors');
const multer = require('multer');
const upload = multer({ dest: 'temp/' });
const ffmpeg = require('fluent-ffmpeg');
const path = require('path');

app.use(cors()); 
const port = 3000;

app.post("/merge-audio", upload.array('files'), async (req, res) => {
    try {
        const command = ffmpeg();
        command
            .input(req.files[0].path)
            .input(req.files[1].path)
            .mergeToFile('merged.wav')
            .on('end', function() {
                console.log('Processing finished !');
                fs.unlinkSync(req.files[0].path)
                fs.unlinkSync(req.files[1].path)
                console.log('Temp files removed !');
                res.sendFile('merged.wav', {root: path.join(__dirname)}, function (err) {
                    if (err) {
                        console.error('Error sending file:', err);
                    } else {
                        console.log('Sent:', 'merged.wav');
                    }
                });
            });

    } catch (error) {
        console.error(error);
        res.status(500).send('Internal server error');
    }
});

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});