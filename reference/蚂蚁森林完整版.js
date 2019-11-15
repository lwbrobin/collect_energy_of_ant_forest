var myEnergeType=["绿色能量","线下支付","行走","共享单车","地铁购票","网络购票","网购火车票","生活缴费","ETC缴费","电子发票","绿色办公","咸鱼交易","预约挂号"];
var morningTime="12:19";//自己运动能量生成时间
unlock()
sleep(1000);
mainEntrence();
 
//解锁
function unlock(){
    if(!device.isScreenOn()){
    	//点亮屏幕
        device.wakeUp();
        sleep(500);
        //swipe(500, 10, 500, 1800, 500);
        //click(100,150);
       // sleep(500);
       // click(1000,140);
        
		//滑动屏幕到输入密码界面
        swipe(550, 1800, 600, 1300, 200);
        //swipe(500, 1800, 700, 1100, 100);
       // gesture()
       gesture(200, [500, 1800],[510, 1750],[530, 1680],[550, 1570],[590, 1440],[670, 1300],[800, 1100])
        sleep(200);
        
       //输入四次 1 （密码为1111）其他密码请自行修改 数字键1的像素坐标为（200,1000）
        click(240,1255);
        sleep(200);       
        click(240,1255);
        sleep(200);        
        click(240,1255);
        sleep(200);        
        click(240,1255);
        sleep(500); 
       // back()
        //sleep(50)
        //back()
    }
}
 
/**
 * 日志输出
 */
function tLog(msg) {
    toast(msg);
    console.log(msg)
}
 
/**
 * 获取权限和设置参数
 */
function prepareThings(){
    setScreenMetrics(1080, 1920);
    //请求截图
   if(!requestScreenCapture()){
        tLog("请求截图失败");
        exit();
    }    
}
/**
 * 设置按键监听 当脚本执行时候按音量减 退出脚本
 */
function registEvent() {
    //启用按键监听
    events.observeKey();
    //监听音量上键按下
    events.onKeyDown("KEYCODE_VOLUME_DOWN", function(event){
        tLog("脚本手动退出");
        exit();
    });
}
/**
 * 获取截图
 */
function getCaptureImg(){
    var img0 = captureScreen();
    if(img0==null || typeof(img0)=="undifined"){
        tLog("截图失败,退出脚本");
        exit();
    }else{
        return img0;
    }
}
/**
 * 默认程序出错提示操作
 */
function defaultException() {
    tLog("程序当前所处状态不合预期,脚本退出");
    exit();
}
/**
 * 等待加载收集能量页面,采用未找到指定组件阻塞的方式,等待页面加载完成
 */
function waitPage(type){
    // 等待进入自己的能量主页
    if(type==0){
        desc("种树").findOne();
    }
    // 等待进入他人的能量主页
    else if(type==1){
        desc("蚂蚁森林").findOne();
    }
    //再次容错处理
    sleep(3000);
}
/**
 * 从支付宝主页进入蚂蚁森林我的主页
 */
function enterMyMainPage1(){
    launchApp("支付宝");
    tLog("等待支付宝启动");
    var i=0;
    sleep(500);
    
    //toastLog("click");
    //sleep(3000);
    //五次尝试蚂蚁森林入
    swipe(520,1200,520,600,500);
    sleep(500);
    swipe(520,600,520,1300,500);
    while (!textEndsWith("蚂蚁森林").exists() && i<=5){
        //click(100,640);
        sleep(1000);
        i++;   
    }
    //click(100,700);
    clickByText("蚂蚁森林",true,"请把蚂蚁森林入口添加到主页我的应用");
    //等待进入自己的主页
    //waitPage(0);
    sleep(3000)
}

function enterMyMainPage(){
    launchApp("支付宝");
    tLog("等待支付宝启动");
    var i=0;
    sleep(500);    

    //五次尝试蚂蚁森林入
	var object = null;
	do
	{
		object = className('android.widget.TextView').text("蚂蚁森林").depth('22').findOne();
		sleep(1000);
        i++;   
	}
	while(object == null && i<=5)
	
	if(object!= null)
	{
		b = object.bounds();
		click(b.centerX(), b.centerY());   // 进入蚂蚁森林
 sleep(1500);		
	}
	else{
		defaultException();
	}
}

function collect_own_energy(){
	ob = className('android.widget.Button').depth('14').textStartsWith("收集能量").find();
	if (!ob.empty()) {
		ob.forEach(function(currentValue, index) {
			let a = currentValue.bounds();
			click(a.centerX(), a.centerY());   // 收集能量
			toastLog(currentValue.text(),index)});
			}
}


/**
 * 进入排行榜
 */
function enterRank(){
	tLog("进入排行榜");
    sleep(800);
    //Swipe(500,1000,520,300,1000);
    swipe(520,1800,520,300,500);
    sleep(500);
    swipe(520,1800,520,300,500);
    sleep(500);
    swipe(520,1800,520,800,500);

	re = className("android.view.View").depth(13).indexInParent(5).clickable().find().click();
	
	//re = text("查看更多好友").clcik();
	if(re)
	{
		toastLog("进入好友排行榜");
		sleep(1000);
		if(textEndsWith("查看更多好友").exists())
		{
			toastLog("查看更多好友存在");
		}
	}
	else{
		defaultException();
	}
sleep(1500);
    //var i=0;
    ////等待排行榜主页出现
    //sleep(2000);
    //while (!textEndsWith("查看更多好友").exists() && i<=5){
	//	sleep(2000);
    //    i++;
    //}
    //if(i>=5){
    //    defaultException();
    //}
}
/**
 * 从排行榜获取可收集好友的点击位置
 * @returns {*}
 */
function  getHasEnergyfriend(type) {
    var img = getCaptureImg();
    var p=null;
    if(type==1){
        //img 是图片
        //"#30bf6c" 第一个颜色
        //[0, 33, "#30bf6c"] 第二颜色和它的相对坐标
        //[34,45, "#ffffff"] 第三个颜色和他的相对坐标
        //region: [1030, 100, 1, 1700] 第一个颜色的检测区域1030，100为起始坐标，1，1700为区域宽度！！！
        //toastLog("开始定位坐标");
        p = images.findMultiColors(img, "#1da06d",[[40, 45, "#ffffff"], [38,34, "#ffffff"]], {
            region: [1010,200 , 1, 1700]
        });
    }
    if(p!=null){
	//	toastLog(p);
        return p;
    }else {
        return null;
    }
}
/**
 * 判断是否好有排行榜已经结束
 * @returns {boolean}
 */
function isRankEnd() {
    var img = getCaptureImg();
    var p=null;
    {
        //img 是图片
        //"#30bf6c" 第一个颜色
        //[0, 33, "#30bf6c"] 第二颜色和它的相对坐标
        //[34,45, "#ffffff"] 第三个颜色和他的相对坐标
        //region: [1030, 100, 1, 1700] 第一个颜色的检测区域1030，100为起始坐标，1，1700为区域宽度！！！
        //toastLog("开始定位坐标");
        p = images.findMultiColors(img, "#30bf6c",[[0, 60, "#30bf6c"], [150,0, "#30bf6c"]], {
            region: [852,100 , 1, 1700]
        });
    }
    if(p!=null){
        return true;
    }else {
        return false;
    }
}
/**
 * 在排行榜页面,循环查找可收集好友
 * @returns {boolean}
 */
function enterOthers(){
    //tLog("开始检查排行榜");
    var i=1;
	toastLog("开始检查排行榜");
    //var ePoint=getHasEnergyfriend(1);
	var img = getCaptureImg();
	var ePoint = images.findMultiColors(img, "#1DA06D",[[58, 0, "#1DA06D"], [38,34, "#FEFEFE"]], {
            region: [900,200 ],
			 threshold: 4
        });
//	toastLog(ePoint);
    //确保当前操作是在排行榜界面
    while(ePoint==null && textEndsWith("好友排行榜").exists()){
         //滑动排行榜 root方式的的点击调用.如无root权限,7.0及其以上可采用无障碍模式的相关函数
        swipe(520,1800,520,600,500);
        sleep(100);
        //ePoint=getHasEnergyfriend(1);
		var img = getCaptureImg();
		var ePoint = images.findMultiColors(img, "#1DA06D",[[58, 0, "#1DA06D"], [38,34, "#FEFEFE"]], {
            region: [900,200 ],
			 threshold: 4
        });
	//	toastLog(ePoint);
        i++;
        //检测是否排行榜结束了
        if(isRankEnd()){
            sleep(1000);
            return false;
        }
        //如果连续32次都未检测到可收集好友,无论如何停止查找(由于程序控制了在排行榜界面,且判断了结束标记,基本已经不存在这种情况了)
        else if(i>32){
            tLog("程序可能出错,连续"+i+"次未检测到可收集好友");
            return false;
            //exit();
        }
    }
    if(ePoint!=null){
        
        //点击位置相对找图后的修正
        tLog(ePoint.x,ePoint.y);
        click(ePoint.x,ePoint.y+20);
        //waitPage(1);
        sleep(2000);
		ob = className('android.widget.Button').depth('14').textStartsWith("收集能量").find();
		if (!ob.empty()) {
		//	toast(ob.length);
			ob.forEach(function(currentValue, index) {
				a = currentValue.bounds();
				click(a.centerX(), a.centerY());   // 收集能量
				toast(currentValue.text(),index)});
			} 
		else {
		toast("收完╭(╯^╰)╮");
		}
		sleep(800);
        //进去收集完后,递归调用enterOthers
        back();
        sleep(2000);
        var j=0;
        //等待返回好有排行榜
        if(!textEndsWith("好友排行榜").exists() && j<=5){
            sleep(2000);
            j++;
        }
        if(j>=5){
            defaultException();
        }
        enterOthers();
    }else{
        defaultException();
    }
}



/**
 * 根据描述值 点击
 * @param energyType
 * @param noFindExit
 */
function clickByDesc(energyType,paddingY,noFindExit,exceptionMsg){
    if(descEndsWith(energyType).exists()){
        descEndsWith(energyType).find().forEach(function(pos){
            var posb=pos.bounds();
            click(posb.centerX(),posb.centerY()-paddingY);
            sleep(200);
        });
    }else{
        if(noFindExit!=null && noFindExit){
            if(exceptionMsg !=null){
                tLog(exceptionMsg);
                exit();
            }else{
                defaultException();
            }
        }
    }
}
/**
 * 根据text值 点击 * @param energyType * @param noFindExit
 */
function clickByText(energyType,noFindExit,exceptionMsg){
    if(textEndsWith(energyType).exists()){
        textEndsWith(energyType).find().forEach(function(pos){
            var posb=pos.bounds();
            click(posb.centerX(),posb.centerY()-60);
        });
    }else{
        if(noFindExit!=null && noFindExit){
            if(exceptionMsg !=null){
                tLog(exceptionMsg);
                exit();
            }else{
                defaultException();
            }
        }
    }
}
/**
 * 遍历能量类型,收集自己的能量
 */
function collectionMyEnergy(){
    //var energyRegex=generateCollectionType();
    //var checkInMorning=false;
    //如果是早上7点03分左右的话.等待主页能量出现 每隔一秒检测一次
    sleep(1000);
    for(var row = 640;row < 900;row+=70)
           for(var col = 140;col < 800;col+=70){
               click(col,row);
               //sleep(50);
               }
    tLog("自己能量收集完成");
    sleep(100);
}
/**
 * 结束后返回主页面
 */
function whenComplete() {
    tLog("结束");
    back();
    sleep(1500);
    back();
    //exit();
}
/**
 * 根据能量类型数组生成我的能量类型正则查找字符串
 * @returns {string}
 */
function generateCollectionType() {
    var regex="/";
    myEnergeType.forEach(function (t,num) {
        if(num==0){
            regex+="(\\s*"+t+"$)";
        }else{
            regex+="|(\\s*"+t+"$)";
        }
    });
    regex+="/";
    return regex;
}
function isMorningTime() {
    var now =new Date();
    var hour=now.getHours();
    var minu=now.getMinutes();
    var targetTime=morningTime.split(":");
    if(Number(targetTime[0])==hour && Math.abs(Number(targetTime[1])-minu)<=2){
        return true;
    }else{
        return false;
    }
}
function repeat(){
    var i = 0;
    while(i< 1){
    i++;
    sleep(5000);
    enterMyMainPage();
    //收集自己的能量
    //if(isMorningTime())
    collectionMyEnergy();
    //进入排行榜
    enterRank();
    //在排行榜检测是否有好有的能量可以收集
    enterOthers();
    //结束后返回主页面
    whenComplete();
    }
    }
	
//程序主入口
function mainEntrence(){
    //前置操作
    prepareThings();
    //注册音量下按下退出脚本监听
    registEvent();
    //从主页进入蚂蚁森林主页
    enterMyMainPage();
    //收集自己的能量
    //collectionMyEnerg
