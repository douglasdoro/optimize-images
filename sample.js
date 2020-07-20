var AWS = require('aws-sdk');
var uuid = require('node-uuid');

// Create an S3 client
var s3 = new AWS.S3();

// Create a bucket and upload something into it
//var bucketName = 'node-sdk-sample-' + uuid.v4();
//var keyName = 'hello_world.txt';

// s3.createBucket({Bucket: bucketName}, function() {
//   var params = {Bucket: bucketName, Key: keyName, Body: 'Hello World!'};
//   s3.putObject(params, function(err, data) {
//     if (err)
//       console.log(err)
//     else
//       console.log("Successfully uploaded data to " + bucketName + "/" + keyName);
//   });
// });


(async () => {


  // var getParams  = {
  //   Bucket: "serverlessoptimizeimage",
  //   Key: "uploads/4-up on 29-05-20 at 23.29 #2.jpg" //"file.txt" //"lo-e-eu.jpg"
  // };
  // const data = await s3.getObject(getParams).promise();
  // //console.log('data: ', data.Body.toString('utf-8'));
  // console.log('data: ', data);

  
  // await s3.putObject({
  //   Bucket: "serverlessoptimizeimage",
  //   Key: "uploads/file1.txt",
  //   Body: 'Opa. Agora vai!'
  // }).promise(); 

  let listObjectsKeys = [];  
  const list = await s3.listObjects({ Bucket: 'serverlessoptimizeimage', MaxKeys: 6}).promise(); 
  list.Contents.map( object => {
    //console.log(object); 
    listObjectsKeys.push(object.Key);
  }); 

  listObjectsKeys.map( async key => {
    const data = await s3.getObject({ Bucket: 'serverlessoptimizeimage', Key: key }).promise();
    
    console.log('data: ', data);
  });

})();



