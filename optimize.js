'use strict';

const AWS = require('aws-sdk');
const { basename, extname } = require('path'); 
const sharp = require('sharp');

const s3 = new AWS.S3({apiVersion: '2006-03-01'}); 

module.exports.handle = async ({ Records: records }) => {
  try {
    await Promise.all(
      records.map(async record => {
        const { name: bucketName } = record.s3.bucket;
        const { key } = record.s3.object; 
        const keyDecoded = decodeURIComponent(key).replace(/\+/gi, ' ');
      
        const image = await s3.getObject({ 
          Bucket: bucketName,
          Key: keyDecoded
        }).promise();

        const optimized = await sharp(image.Body)
          .resize(1280, 720, { fit: 'inside', withoutEnlargement: true })
          .toFormat('jpeg', { progressive: true, quality: 50 })
          .toBuffer();

        await s3.putObject({
          Body: optimized,
          Bucket: bucketName,
          ContentType: 'image/jpg',
          Key: `compressed/${basename(keyDecoded, extname(keyDecoded))}.jpg`
        }).promise(); 
      })
    );
  } catch (err) {
    console.error(err);
  }

  return {
    statusCode: 200,
    body: JSON.stringify(
      {
        message: 'ok'
      },
      null,
      2
    ),
  };
};
