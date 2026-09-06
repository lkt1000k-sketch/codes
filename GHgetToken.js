var strJson = $request.headers
console.log(strJson)
$notification.post("Storm Sniffer","Network Debug Tool","✅ 获取token成功");
$done()

//上传代码
