
auto();
requestScreenCapture();
//解锁
unlock("1111");//里面是你的锁屏密码，仅支持数字解锁，并且需要点击确定键，需要点击确定键的需要自己改一下解锁函数
home()
threads.start(function(){
    toast("按音量下键停止脚本")
    //启动监听
    events.observeKey();
    //监听音量下键
    events.onKeyDown("volume_down",function(event){
        toast("已停止")
        exit();
    })
    
});

//var width=device.width;
//启动app
//launchApp("支付宝");
sleep(500)
var zfb=desc("支付宝").findOne();
if(zfb)
{
	b=zfb.bounds()
	click(b.centerX(),b.centerY())	
}
waitForActivity("com.eg.android.AlipayGphone.AlipayLogin");
toastLog("启动成功")
var w=text("蚂蚁森林").className("android.widget.TextView").findOne();
var b=w.bounds();
if(w==null){
    log("null");
}
//点击蚂蚁森林
if(click(b.centerX(),b.centerY())){    
    log("点击成功");
}else{
    log("点击失败");
}

 setScreenMetrics(1080, 2160);
//收集自己的能量
sleep(2000);
if(collectEnergy())
	toastLog("自己能量收集完成");
else
	toastLog("自己没能量");


//偷好友能量
sleep(1000);
stealEnergy();

toastLog("偷能量完成");

sleep(1000);
back();
sleep(1000);
back();
sleep(1000);

//关闭应用，仅有root权限下有用
shell("am force-stop com.eg.android.AlipayGphone",true);

exit();


//解锁函数
function unlock(password){
	if (!device.isScreenOn()) {
	//device.wakeUpIfNeeded();
	device.wakeUp();
	sleep(1000);  //等待屏幕亮起
	//miui锁屏滑动不能唤出密码输入 通过下拉通知栏点击时间进入密码解锁 
	  		  swipe(500, 30, 500, 1000, 300); 
	    	sleep(400); 
	    //点击时间 
	    click(100, 120);

	    //解锁 密码1111
	    desc(1).findOne().click(); 
	    desc(1).findOne().click(); 
	    desc(1).findOne().click(); 
	    desc(1).findOne().click(); 
	    //等待解锁完成，返回并退出
	toast("解锁成功");
	sleep(1000)
	}
}

// 收能量
function collectEnergy(){
	var ob = className('android.widget.Button').depth('14').textStartsWith("收集能量").find();
	if (!ob.empty()) {
		toastLog(ob.length + "个能量可收集");
		ob.forEach(function(currentValue, index) {
			let a = currentValue.bounds();
		click(a.centerX(), a.centerY())});   // 收集能量
		return true;
			}
	else
		return false;
}

//找好友的能量
function findFriendEnergy(){
    //截图
    var img = captureScreen();
    //toastLog("开始找色");
    //var point = findColor(img, "#1DA06D");
    //var point = findColorInRegion(img,"#1DA06D", 0, 0, device.width,device.height-300);
	var point = images.findMultiColors(img, "#1da06d",[[40, 45, "#ffffff"], [38,34, "#ffffff"], [54,11, "#1da06d"]], {
            region: [1000,200],
			 threshold: 1
        });
    if(point){
       //toastLog("x = " + point.x + ", y = " + point.y);
       //点击进去偷能量
       click(point.x,point.y+50);
       return true;
    }else{
       toastLog("没找到");
       return false;
    }
}


//滑动屏幕找到更多好友
function swipeScreenFirst(){    
    //gesture(1000,[500,1500],[500,500])
    swipe(500,1600,500,500,500);
    var i=5;
    while(true){
        if(className("android.view.View").depth(13).indexInParent(5).clickable().exists()){
			className("android.view.View").depth(13).indexInParent(5).clickable().find().click();
			//desc("查看更多好友").findOne().click();
			sleep(2000);
			break;
        }
        swipe(500,1700,500,1000,500);
        if(i==0){
            toastLog("没有找到更多好友");
            sleep(2000)
            back();
            sleep(2000);
            //关闭应用，仅有root权限下有用
            shell("am force-stop com.eg.android.AlipayGphone",true);
            exit();
        }        
        i--;
    }
    
}


//滑动屏幕
function swipeScreen(){
    //滑动一个好友的距离
    //gesture(1000,[500,1500],[500,500])
    swipe(500,1800,500,500,500);
    
}

//偷好友能量
function stealEnergy(){
    //滑动屏幕，找到查看更多好友进入到好友排行榜
    swipeScreenFirst();
    sleep(800);
    	
   //一个一个偷能量
   var should_exit = false;
    while(!should_exit){
        if(findFriendEnergy()){
            sleep(1000);
            collectEnergy();
            back();
            sleep(1000);
            swipeScreen();
        }else{
			//var w=text("蚂蚁森林").className("android.widget.TextView").findOne();
			//var b=w.bounds();
			if(text("没有更多了").exists())
			{
				should_exit = true;
			}				
			else
			{
				swipeScreen();
				sleep(800);					
			}
        }
        
    }
}