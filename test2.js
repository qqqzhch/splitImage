const { createCanvas, loadImage } = require('canvas')
const ColorThief = require('colorthief');
const walkSync = require('walk-sync');
var fs = require("fs");
var base64Img = require('base64-img');
const random = require('random')
const path = require('path')
const FastAverageColor = require('fast-average-color-node');
var load = require('./lib/load_images');
var SSIM = require('image-ssim');
// import ssim from "ssim.js";

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
    const imglist = ['Ringer_106.png','Ringer_110.png','Ringer_119.png',
    'Ringer_122.png','Ringer_232.png','Ringer_231.png']
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
        console.log('颜色相似的',minimg)
        Structuralsimilarity(src,minimg);
        
        
   
    
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
    minImg=minImg.slice(0,10)
    console.log(minImg)



    return minImg;


}

async function Structuralsimilarity(imgfile,imgfileList){
    
    var  img1 = await loadImage(imgfile);
    var  img2 = await loadImage('./img/'+imgfileList[0].img);
    console.log( img1)
    var  imgfile2='./img/'+imgfileList[0].img
    console.log(load)
    var img3 = await Imagezoom(img1,img2);

    // var ssim = SSIM.compare(img3, img2);
    // console.log(ssim)
    imgfileList.forEach( async (imgpath)=>{
        console.log('./img/'+imgpath.img)
        var  img2 = await loadImage('./img/'+imgpath.img);
        var img2_ = await Imagezoom(img2,img2)
        // console.log(img3, img2)
        var ssim = SSIM.compare(img3, img2_);
        console.log(ssim,imgpath)
    })

}

async function Imagezoom(img,imgtarget){

    var num = Math.floor(6000/img.naturalWidth )
    console.log('放大',num)
    var wpiece = imgtarget.naturalWidth ;
    var hpiece = imgtarget.naturalHeight ;
    
    var src = '';
    
    var canvas = createCanvas(wpiece, hpiece);
    var ctx = canvas.getContext('2d');

    canvas.width = wpiece;
    canvas.height = hpiece;
    ctx.drawImage(img, 0, 0, wpiece, hpiece)
    var id = ctx.getImageData(0, 0, canvas.width, canvas.height);
    return {width: canvas.width, height: canvas.height, data: id.data, channels: 4}
}

Calculatecolor();