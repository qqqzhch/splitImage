const { createCanvas, loadImage } = require('canvas')
const ColorThief = require('colorthief');
const walkSync = require('walk-sync');
var fs = require("fs");
var base64Img = require('base64-img');
const random = require('random')
const FastAverageColor = require('fast-average-color-node');
var SSIM = require('image-ssim');

var rowNum=4;
var columnNum=4;

var util = {
    cancel: function (event) {
        event.preventDefault();
        event.stopPropagation();
    },
    val: function (value) {
        return value && value > 0 ? value : 1;
    }
}

async function getColor(path){
    var color = await FastAverageColor.getAverageColor(path);
    var  color2=color.value;
    return color2;
}

function euclideandistance(a, b) {
    var sum = 0
    var n
    for (n = 0; n < a.length; n++) {
      sum += Math.pow(a[n] - b[n], 2)
    }
    return sum
  }
async function  main(){
    var img_ =await loadImage('unnamed.png')
    var img =await makeBigImg(img_)
    var arTimgList = await createPiece(img, rowNum, columnNum)
    // console.log(arTimgList);
    var result = await Calculatecolor(arTimgList,img)
      



}

main()

async function createPiece(img, row, column) {
    row = util.val(row);
    column = util.val(column);

    var wpiece = Math.floor(img.naturalWidth / column);
    var hpiece = Math.floor(img.naturalHeight / row);

    var canvas = createCanvas(wpiece, hpiece);
    var ctx = canvas.getContext('2d');

    

    var src = '';
    var html = '';

    canvas.width = wpiece;
    canvas.height = hpiece;
    // const colorThief = new ColorThief();
     arTimg=[]

    for (var i = 0; i < row; i++) {
        
        
        for (var j = 0; j < column; j++) {
            ctx.drawImage(
                img, 
                j * wpiece, i * hpiece, wpiece, hpiece, 
                0, 0, wpiece, hpiece
            );

            src = canvas.toDataURL();
            // await base64Img.imgSync(src, 'Piece', i+'_'+j);
            
            
            try {
                var imgColor = await getColor(src);
                // console.log(imgColor)
                arTimg.push({
                    i,
                    j,
                    imgColor:imgColor,
                    src
                })
                
            } catch (error) {
                console.log(i,j)
                console.log('分割',src,error)
                
            }
            

        }
        
    }
    
    console.log(arTimg)
    return arTimg;
}


async function Calculatecolor(arTimg,yangbenimg){
    console.log('Calculatecolor')
    
    
    // img.crossOrigin = "Anonymous";
    
    
    
    var rowVal =  rowNum;
    var columnVal =  columnNum;

    const imglist = walkSync('img')
    var imgcolor=[]
    for (let index = 0; index < imglist.length; index++) {
        const img = imglist[index];
        var color = await getColor("./img/"+img);
        imgcolor.push({
            color,
            img

        })

        
    }


    for (let index = 0; index < arTimg.length; index++) {
        var item = arTimg[index];
        var minimg = await findMinImg(item.imgColor,imgcolor)
        var besimilar = Structuralsimilarity(item,imgcolor);

        var maxIndx =besimilar.length>0?besimilar.length-1:0;       
        var myindex = random.int((min = 0), (max = maxIndx))

        item.minimg = minimg[myindex].img;
        console.log(item)
        
    }

    return ;
    



    var rsult = await createImg(yangbenimg,arTimg, rowVal, columnVal);
    console.log(rsult)
    var filepath = base64Img.imgSync(rsult, 'dest', 'demo');
    console.log(filepath)
    // fs.writeFileSync(`./demo.png`, rsult, 'utf-8')
    
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
    minImg=minImg.slice(0,20)
    console.log(minImg)



    return minImg;


}


/**
 * 生成图片碎片
 * 
 * @param {Image} img 
 * @param {number=} row 分割宫格的行数
 * @param {number=} column 分割宫格的列数
 */
 async function createImg(img,imglist, row, column) {
    row = util.val(row);
    column = util.val(column);

    

    var wpiece = Math.floor(img.naturalWidth / column);
    var hpiece = Math.floor(img.naturalHeight / row);

    var src = '';
    
    var canvas = createCanvas(img.naturalWidth, img.naturalHeight);
    var ctx = canvas.getContext('2d');

    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    
     

    for (var i = 0; i < row; i++) {
        
        
        for (var j = 0; j < column; j++) {
            var img_;
            imglist.forEach((one)=>{
                if(one.i==i&&one.j==j){
                    img_ = one.minimg
                }

            })
            var imgData = await loadImage('img/'+img_);

            ctx.drawImage(
                imgData, 
                j * wpiece, i * hpiece, wpiece, hpiece, 
            );
            

            ;
        

        }
        console.log('拼接图片',i)
        
    }
    src = canvas.toDataURL();
     
    return src;
}


async function makeBigImg(img){

    var num = Math.floor(6000/img.naturalWidth )
    console.log('放大',num)
    var wpiece = Math.floor(img.naturalWidth * num);
    var hpiece = Math.floor(img.naturalHeight * num);
    /*
    75
    75


    */

    var src = '';
    
    var canvas = createCanvas(wpiece, hpiece);
    var ctx = canvas.getContext('2d');

    canvas.width = wpiece;
    canvas.height = hpiece;
    ctx.drawImage(img, 0, 0, wpiece, hpiece)
    var src = canvas.toDataURL();
    var filepath = await base64Img.imgSync(src, 'template', '1');
    console.log('放大ok')
    return  await loadImage(filepath)


}


async function Structuralsimilarity(imgfile,imgfileList){

    var  imgoriginal = await loadImage(imgfile.src);
    var  imgscanning = await loadImage('./img/'+imgfileList[0].img);

    imgoriginal = await Imagezoom(imgoriginal,imgscanning);

    // imgfileList.forEach( async (imgpath)=>{
        
    //     var  imgscanning_i = await loadImage('./img/'+imgpath.img);
    //     var imgscanning_i_aj = await Imagezoom(imgscanning_i,imgoriginal)
    //     // console.log(img3, img2)
    //     var ssim = SSIM.compare(imgoriginal, imgscanning_i_aj);
    //     console.log(ssim)
    //     imgpath.ssim=ssim;
    // })

    for (let index = 0; index < imgfileList.length; index++) {
        const element = imgfileList[index];

        var  imgscanning_i = await loadImage('./img/'+element.img);
        var imgscanning_i_aj = await Imagezoom(imgscanning_i,imgscanning)
        // console.log(img3, img2)
        var ssim = SSIM.compare(imgoriginal, imgscanning_i_aj);
        console.log(ssim)
        element.ssim=ssim;
    }

    imgfileList.sort(function(a, b){return a.ssim-b.ssim})
    imgfileList=imgfileList.slice(0,8)
    
    return imgfileList;


}

async function Imagezoom(img,imgtarget){
   console.log(img,imgtarget)
    
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