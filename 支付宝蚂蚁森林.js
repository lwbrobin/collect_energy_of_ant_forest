
auto();
prepareThings()
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
text("蚂蚁森林").waitFor();
var w=text("蚂蚁森林").className("android.widget.TextView").findOne();
var b=w.bounds();
if(w==null){
    log("null");
}
//点击蚂蚁森林
click(b.centerX(),b.centerY())


//收集自己的能量
//sleep(3000);
text("种树").waitFor();
sleep(500);
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
home();
//launchApp("Auto.js");
desc("Auto.js").findOne().click();
//关闭应用，仅有root权限下有用
//shell("am force-stop com.eg.android.AlipayGphone",true);

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
/**
 * 获取权限和设置参数
 */
function prepareThings(){
    setScreenMetrics(1080, 2160);
    //请求截图
   if(!requestScreenCapture()){
        log("请求截图失败");
        exit();
    }    
}
// 收能量
function collectEnergy(){
    className('android.widget.Button').depth('14').clickable().waitFor();
    sleep(500)
var all = className('android.widget.Button').depth('14').textStartsWith("收集能量").find();
//var all = className('android.widget.Button').depth('14').clickable().find();

	if (!all.empty()) {
//		toastLog(ob.length + "个能量可收集");
all.forEach(function(current) {
    //if(current.textContains("收集能量") || current.text()=="")
    current.click()    });
	//		let a = current.bounds();
//		click(a.centerX(), a.centerY())});   // 收集能量
		return true;
			}
	else
	{
    	return false;
    }
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
			 threshold:4
        });
    if(point){
       //toastLog("x = " + point.x + ", y = " + point.y);
       //点击进去偷能量
       click(point.x,point.y+30);
       return true;
    }else{
       //toastLog("没有能量");
       return false;
    }
}


//滑动屏幕找到更多好友
function enter_friend(){    
    for(var i=0;i<5;i++)
    {
        swipe(500,1600,500,700,500);
        if(textContains("查看更多好友").exists())
        {
            textContains("查看更多好友").find().click();
            sleep(1000);
            return;
            }
     }
     toastLog("没有找到更多好友");
            sleep(1000)
            back();
            sleep(1000);
            exit();
 }
        
   // var i=5;
   // while(true){
      //  if(className("android.view.View").depth(13).indexInParent(5).clickable().exists()){
	//		className("android.view.View").depth(13).indexInParent(4).clickable().findOne().click();
			//desc("查看更多好友").findOne().click();
//textContains("查看更多好友").find().click();
//			sleep(1000);
	//		break;


//偷好友能量
function stealEnergy(){
    //滑动屏幕，找到查看更多好友进入到好友排行榜
    enter_friend();
    sleep(800);
    	
   //偷能量
   var should_exit = false;
    while(!should_exit){
        if(findFriendEnergy()){
            //sleep(2000);
            collectEnergy();
            sleep(1000)
            back();
            sleep(1500);
        }
        else{
			if(text("没有更多了").exists())
			{
				should_exit = true;
			}				
			else
			{
swipe(500,1800,500,700,500);
				sleep(1000);					
			}
        }
        
    }
}
