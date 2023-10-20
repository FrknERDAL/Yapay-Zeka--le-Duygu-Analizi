const video = document.getElementById("video");

Promise.all([
  faceapi.nets.tinyFaceDetector.loadFromUri("/models"),
  faceapi.nets.faceLandmark68Net.loadFromUri("/models"),
  faceapi.nets.faceRecognitionNet.loadFromUri("/models"),
  faceapi.nets.faceExpressionNet.loadFromUri("/models")
]).then(startCamera());
/* modelleri yükledik */
function startCamera( ) {
  //   return false;
  navigator.getUserMedia(
    {
      video: {}
    },
    stream => (video.srcObject = stream),
    err => console.log(err)
  );
}
/* kameramızı entegre ettiğimiz kısım */
video.addEventListener("play", () => {
  const canvas = faceapi.createCanvasFromMedia(video);
  document.body.append(canvas);
  const boxSize = { /* yüzümüzü çevreleyen kutu */
    width: video.width,
    height: video.height
  };
/* kamera açıldığında yüz tanıma sistemini aktif etme */
  faceapi.matchDimensions(canvas, boxSize);
/* canvasla oluşan görüntüyle boxsize ı (kutumuz) eşleştiriyor */
  setInterval(async () => {
   
    const detections = await faceapi
      .detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
      /* videodaki tüm yüzleri tespit et */
      .withFaceLandmarks()
      .withFaceExpressions();

    canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);
    /* önceki kutuları temizliyor üst üste gelmemesi için */
    const resizedDetections = faceapi.resizeResults(detections, boxSize);
/* tüm tespitleri alıp kutu içinde yazdırcak */
    faceapi.draw.drawDetections(canvas, resizedDetections);
/* hazırladığımız yüzümüzü çevreleyen kutuyu canvasa yazdırıyopruz */
    faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);
/* tespit edilen duygu değerlinin ne olduğunu noktalarla gösteriyor */
    faceapi.draw.drawFaceExpressions(canvas, resizedDetections);
/* projemizin yapmış olduğu duygu çıkarımlarını yazırıyor*/
   
  }, 100);
});
