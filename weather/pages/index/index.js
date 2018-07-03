//index.js
//获取应用实例
const app = getApp()
var bmap = require('bmap-wx.min.js');
var BMap = new bmap.BMapWX({
  ak: '2C6Hf45WnIpfKZfXVg5QkYMjXr56UfUG'
});
Page({
  data: {
    follow:false,
    judge:'',
    scene:'',
    come:true,
    weathertype:'',
    list_length:true,
    deleteshow:false,
    deleteword:true,
    userInfo: {},
    change_icon:true,
    locShow:'',
    list_index:'',
    nameinput:'',
    popup_show:false,
    hasUserInfo: false,
    list:[],
    isShow: [],
    containerClick:[],
    nameR_Bgcolor:'rgba(255,255,255,0.9)',
    weatherData: '' ,
    location:'',
    address:'',
    latitude:"",
    longitude:'',
    matchMsg:'',
    ready_position:false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  //分享
  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: '快来创建Ta的天气吧',
      path: '/page/user?id=123'
    }
  },
  //初始化
  onShow:function(){
      for(var i=0;i<this.data.list.length;i++){
        this.data.isShow.push(false);
        this.data.containerClick.push(false);
      }
  },
  //总删除按钮
  deletepopup:function(){
    this.setData({
      deleteshow: !this.data.deleteshow,
      deleteword: !this.data.deleteword
    })
  },
  //删除list
  deletelist:function(e){
    var _this=this;
    var index = e.currentTarget.dataset.id;
    wx.showModal({
      content: '确定要删除吗',
      success:function(res){
        if(res.confirm){
          var list=_this.data.list;
          list.splice(index,1);
          var isShow = _this.data.isShow;
          isShow.splice(index, 1);
          wx.setStorage({
            key: 'list',
            data: _this.data.list,
            success: function(res) {
              wx.showToast({
                title: '删除成功',
                icon:'success'
              })
            },
            fail: function(res) {},
            complete: function(res) {},
          })
          if (_this.data.list.length == 0) {
            {
              _this.setData({
                list_length: true,
                deleteword:true,
                deleteshow:false
              })
            }
          }
          _this.setData({
            isShow: isShow,
            list:list,
          });
        }
      }
    })
  },
  //打开引流弹窗
  openfollow:function(){
    this.setData({
      follow:true
    })
  },

  //关闭引流弹窗
  closefollow:function(){
    this.setData({
      follow: false
    })
  },

  //打开弹窗
  openpopup:function(){
    this.setData({
      popup_show:!this.data.popup_show
    })
  },
  //获取输入框内容
  nameinput:function(e){
    this.setData({
      nameinput:e.detail.value
    })
  },
  //选择位置
  chooselocation:function(e){
    //success函数实际是一个闭包 ，无法直接通过this来setData
    var _this=this;
    var use;
    wx.showLoading({
      title: '地图加载中...',
    })
    wx.chooseLocation({
      success: function(res) {
        // 引入SDK核心类
        var QQMapWX = require('qqmap-wx-jssdk.js');

        // 实例化API核心类
        var demo = new QQMapWX({
          key: 'NQVBZ-Z7QC6-47ZSJ-EJDFB-2D43S-I6BSC' // 必填
        });

        // 调用接口反向得知地址
        demo.reverseGeocoder({
          location: {
            latitude: res.latitude,
            longitude: res.longitude
          },
          success: function (res) {
            console.log(res);
            if (res.result.address_component.nation=='中国'){
              _this.setData({
                locShow: '已选择：' + res.result.address,
                address:res.result.address,
                ready_position: true,
              });
            }
            else{
              // wx.showModal({
              //   title: '',
              //   content: '暂时不提供国外的天气服务，请谅解',
              // })
              wx.showToast({
                title: '暂时不提供国外的天气服务，请谅解',
                icon: 'none'
              })
              _this.setData({
                locShow: '请重新选择Ta的位置'
              });
            }
          },
          fail: function (res) {
            console.log(res);
          },
          complete: function (res) {
            console.log(res);
          }
        });


        _this.setData({
          location: res.longitude + ',' + res.latitude,
        })
      },
      fail: function(res) {},
      complete: function (res) { wx.hideLoading()},
    })
  },
  //添加新的对象
  addlist:function(e){
    var _this=this;
    if (this.data.nameinput!=''){
      console.log(this.data.location);
      if (this.data.ready_position){
        var a = {
          mainname: this.data.nameinput,
          address: this.data.address,
          location: this.data.location
        }
        this.data.list.push(a);
        this.data.isShow.push(false);
        wx.setStorage({
          key: 'list',
          data: this.data.list,
          success: function (res) { },
          fail: function (res) { },
          complete: function (res) { },
        })
        // var type='';
        // if(this.data.)
        this.setData({
          list: this.data.list,
          popup_show: !this.data.popup_show,
          nameinput: '',
          locShow: '',
          list_length: false,
          // weathertype:this.data.weathertype
        })
        wx.showToast({
          title: '添加成功',
          icon: 'success',
          image: '',
          duration: 0,
          mask: true,
          success: function (res) { 
            _this.setData({
              ready_position:false,
            })
          },
          fail: function (res) { },
          complete: function (res) { },
        })
      }else{
        wx.showToast({
          title: '请选择位置',
          icon: 'none'
        })
      }
    }
    else{
      wx.showToast({
        title: '昵称不能为空',
        icon:'none'
      })
    }
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  nameCas: function (e) {
    console.log(e)
  },
  onLoad: function () {
    var that = this;
    var scene_img = '../../img/erweima.png' //这里添加图片的地址  
    that.setData({
      scene: scene_img
    }) 
    wx.getStorage({
      key: 'come',
      success: function(res) {
        if(res.data=='1'){
          that.setData({
            come: false
          })
        }
      },
    });
    wx.setStorage({
      key: 'come',
      data: '1',
    });
    wx.getStorage({
      key: 'list',
      success: function (res) {
        console.log(res.data)
        for (var a in res.data) {
          that.data.list.push(res.data[a])
        }
        that.setData({
          list: that.data.list
        },function(){
          if (that.data.list.length == 0) {
            {
              that.setData({
                list_length: true
              })
            }
          }
        })
      },
    })
  },
  //下拉隐藏天气
  toggle_show:function(event){
    this.setData({
      judge:''
    })
    var that=this;
    var index = event.target.dataset.id;
    //打开时
    if(!this.data.isShow[index]){
      wx.showLoading({
        title: '正在加载...',
      })
      // 新建百度地图对象 
      var fail = function (data) {
        console.log(data)
      };
      var success = function (data) {
        console.log(data)
        var index = event.target.dataset.id;
        var weatherData = data.currentWeather[0];

        // 判断晴阴
        var judge;
        if (weatherData.weatherDesc.indexOf('雨')!='-1'){
          judge='rain';
        }
        else if (weatherData.weatherDesc.indexOf('晴')!= '-1'){
          judge ='sun';
        }
        else{
          judge="unsun";
        }
        that.data.judge=judge;
        var temp = data.currentWeather[0];
        var date = weatherData.date;
        console.log(date.split('('))
        weatherData = '地区：' + weatherData.currentCity + '\n' + 'PM2.5：' + weatherData.pm25 + '\n' + '日期：' + date.split('(')[0] + '\n' + '温度：' + weatherData.temperature + " "+ "("+date.split('(')[1]+ '\n' + '天气：' + weatherData.weatherDesc + '\n' + '风力：' + weatherData.wind + '\n';
          //匹配天气信息
        var w = temp.weatherDesc, t = temp.temperature, p = temp.pm25;
        var san='';//伞
        var mask='',sun='';//口罩,防晒
        if (w.search('雨')!=-1 || w.search('雪')!=-1 ||w.search('阴')!=-1 ){
          san="需要带伞";
        }else{
          san = "不用带伞";
        }
        if (w.search('阳') !=-1 || w.search('晴')!=-1) {
          sun = "需要防晒";
        } else {
          sun = "不用防晒";
        }
        if (p>100) {
          mask = "需要口罩";
        } else {
          mask = "不用口罩";
        };
        var msg = san + '\n' + mask + '\n' + sun;
        // that.data.list[index].address = temp.currentCity;
        that.setData({
          weatherData: weatherData,
          // list: that.data.list,
          matchMsg: msg,
          judge:judge,
        });
      }
      // 发起weather请求 
      var index = event.target.dataset.id;
      BMap.weather({
        location: that.data.list[index].location,
        fail: fail,
        success: success
      });
      //关闭所有列表
      for (var i = 0; i < this.data.isShow.length;i++){
        if(i!=index){
          this.data.isShow[i] = false;
        }
      };
      //打开点击列表
      this.data.isShow[index] = !this.data.isShow[index];
      this.data.containerClick[index] = !this.data.containerClick[index];   
      this.setData({
        change_icon:!this.data.change_icon,
        isShow: this.data.isShow,
        containerClick: this.data.containerClick
      });
      setTimeout(function () {
        wx.hideLoading()
      }, 200)
    }else{
      //关闭所有列表
      for (var i = 0; i < this.data.isShow.length; i++) {
        if (i != index) {
          this.data.isShow[i] = false;
        }
      };
      //打开点击列表
      this.data.isShow[index] = !this.data.isShow[index]; this.data.containerClick[index] = !this.data.containerClick[index];
      this.setData({
        change_icon: !this.data.change_icon,
        isShow: this.data.isShow,
        containerClick: this.data.containerClick
      });
    }
  },
})
