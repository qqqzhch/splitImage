const { createCanvas, loadImage } = require('canvas')
const ColorThief = require('colorthief');
const walkSync = require('walk-sync');
var fs = require("fs");
var base64Img = require('base64-img');
const random = require('random')
const path = require('path')
const FastAverageColor = require('fast-average-color-node');

console.log(FastAverageColor)

function euclideandistance(a, b) {
    var sum = 0
    var n
    for (n = 0; n < a.length; n++) {
      sum += Math.pow(a[n] - b[n], 2)
    }
    return sum
  }

async function Calculatecolor(){
    console.log('Calculatecolor')
    
    

    // const imglist = walkSync('img')
    const imglist = ['Ringer_106.png','Ringer_110.png','Ringer_119.png','Ringer_122.png','Ringer_232.png']
    var imgcolor=[]
    
    for (let index = 0; index < imglist.length; index++) {
        const img = imglist[index];
        var color = await FastAverageColor.getAverageColor("./img/"+img);
        console.log(color)
        color=color.value;
        imgcolor.push({
            color,
            img

        })
        // console.log(color,imglist.length,index)

        
    }


       var src  = path.resolve(process.cwd(), './Piece/14_56.png');
        var itemimgColor= await FastAverageColor.getAverageColor(src);
        itemimgColor=itemimgColor.value;
        console.log('比较',itemimgColor,imgcolor)
        var minimg = await findMinImg(itemimgColor,imgcolor)
        console.log(minimg)
        
        
   
    
}

async function findMinImg(imgColor,imgcolorlist){
    
    
    var min;
    var minImg=[];
    

    for (let index = 0; index < imgcolorlist.length; index++) {
        const img = imgcolorlist[index].img;
        var Color = imgcolorlist[index].color;
        // console.log(Color)
        

        var flag = euclideandistance(imgColor,Color)
        // if(min==undefined){
        //     min=flag;
        //     minImg=img;
        // }else if(flag<min){
        //     min=flag;
        //     minImg=img;
        // }
        minImg.push({img,num:flag})
        
    }
    minImg=minImg.sort(function(a, b){return a.num-b.num})
    minImg=minImg.slice(0,4)
    console.log(minImg)



    return minImg;


}

Calculatecolor();