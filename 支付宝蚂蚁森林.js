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
function collect_energy(is_my_own){
    className('android.widget.Button').depth('14').clickable().waitFor();  // 等待进入
    sleep(500)
	var all;
	if(is_my_own){
		all = className('android.widget.Button').depth('14').textContains("收集能量").find();	
	}
	else{
		all = className('android.widget.Button').depth('14').clickable().find();
	}
	
	//var all = className('android.widget.Button').depth('14').clickable().find();
	if (!all.empty()) {
		all.forEach(function(current) {
			if(current.find(textContains("收集能量")) || current.text()=="")
		{
			click(current.bounds().centerX(),current.bounds().centerY());
			//current.click();   //点击无效，采用坐标点击
		}
    });
		return true;
	}
	else
	{
    	return false;
    }
}

//找好友的能量
function find_and_enter_friend(){
    //截图
    var img = captureScreen();
    //var point = findColor(img, "#1DA06D");
    //var point = findColorInRegion(img,"#1DA06D", 0, 0, device.width,device.height-300);
    	var point = images.findMultiColors(img, "#1da06d",[[40, 45, "#ffffff"], [38,34, "#ffffff"], [54,11, "#1da06d"]], {
            region: [1000,200],
			 threshold:4
        });
    if(point){
       //点击进去偷能量
       click(point.x,point.y+30);
       return true;
    }else{
       return false;
    }
}

//滑动屏幕找到更多好友
function enter_friend_rank(){    
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
     toastLog("没有找到更多好友,退出");
     sleep(1000)
     back();
     sleep(1000);
     exit();
 }     

//偷好友能量
function start_steal_energy(){
    enter_friend_rank();   // 进入到好友排行榜
    sleep(800);
    	
   //开始偷能量	
	while(!text("没有更多了").exists())	  // 循环查找直到出现"没有更多了"按钮	
		{
			if(find_and_enter_friend()){
				collect_energy(false);
				sleep(1000)
				back();
				sleep(1500);
			}
			else{
				swipe(500,1800,500,700,500);
				sleep(1000);		
			}
		}
}


auto();
prepareThings()
//解锁
//unlock("1111");//解锁函数不稳定，去掉此功能
//home()
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
launchApp("支付宝");
sleep(500);
if(currentActivity() != "com.eg.android.AlipayGphone.AlipayLogin")   // 如果支付宝启动未成功，则尝试用按钮启动
	{
		home();
		var zfb=desc("支付宝").findOne();
		if(zfb)	{
			b=zfb.bounds()
			click(b.centerX(),b.centerY())	
		}	
	}
waitForActivity("com.eg.android.AlipayGphone.AlipayLogin");
//toastLog("启动成功")
text("蚂蚁森林").waitFor();
var w=text("蚂蚁森林").className("android.widget.TextView").findOne();
var b=w.bounds();
if(w==null){
    log("null");
	exit();
}
//点击蚂蚁森林
click(b.centerX(),b.centerY());

//收集自己的能量
text("种树").waitFor();//等待进入蚂蚁森林
sleep(500);
if(collect_energy(true))
	toastLog("自己能量收集完成");
else
	toastLog("自己没能量");

//偷好友能量
sleep(1000);
start_steal_energy();
toastLog("偷能量完成");
sleep(500);
back();
sleep(500);
back();
sleep(500);
home();
//launchApp("Auto.js");
desc("Auto.js").findOne().click();
//关闭应用，仅有root权限下有用
//shell("am force-stop com.eg.android.AlipayGphone",true);
exit();
