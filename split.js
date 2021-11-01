/**
 * @file split image into n * m pieces by upload or drag image
 * @author wxp
 */

/**
 * helper - 辅助函数
 *
 */
var util = {
    $: function (id) {
        return typeof id == 'string' ? document.getElementById(id) : null;
    },
    cancel: function (event) {
        event.preventDefault();
        event.stopPropagation();
    },
    val: function (value) {
        return value && value > 0 ? value : 1;
    }
};

/**
 * 文件预处理
 * 
 * @param {(string | File)} file 上传的文件对象或者url路径
 */
function handleFile(file) {
    if (!file) {
        return;
    }

    // 从其他页面拖拽图片，获取url路径，可能是data:url或者普通的url
    // todo: 兼容性不好,仅chrome支持
    if (typeof file === 'string') {
        var source = file.match(/src=(?:'|")(.+jpe?g|png|gif)/);

        if (!source) {
            alert('图片格式不合法！请上传jpg, png, gif, jpeg格式的图片');
            return;
        }

        var imgUrl = source[1];

        util.$('preview').innerHTML = '<img src="' + imgUrl + '" />';

        handlePiece(imgUrl);

        return;
    }

    if (!file.type || !file.type.match('image/')) {
        alert('图片格式不合法！请上传jpg, png, gif, jpeg格式的图片');
        return;
    }

    // 文件超过2M
    if (!file.size || !file.size > 2 * 1024 * 1024) {
        alert("请上传2M以内的图片哦，亲~~");
        return;
    }

    /**
     * blob文件读取完毕时触发
     *
     * @event
     * @param {Object} event
     */
    var reader = new FileReader();
    reader.onload = function (event) {
        source = event.target.result;
        util.$('preview').innerHTML = '<img src="' + source + '" />';
        handlePiece(source);
    };
    reader.readAsDataURL(file);
}

/**
 * 初始化事件绑定
 * 
 */
function initFile() {
    var previewDiv = util.$('preview');
    var fileInput = util.$('imgFile');
    
    var row =  util.$('row');
    var column =  util.$('column');

    previewDiv.ondragenter = function (event) {
        util.cancel(event);
        this.style.borderColor = '#f00';
    };

    previewDiv.ondragover = function (event) {
        util.cancel(event);
    };

    previewDiv.ondragleave = function () {
        this.style.borderColor = '#00f';
    };

    previewDiv.ondrop = function (event) {
        util.cancel(event);
        
        var file = event.dataTransfer.files[0];
        var html = event.dataTransfer.getData('text/html');
        
        this.style.borderColor = '#00f';

        handleFile(file || html);
    };

    /**
     * 通过input上传的文件发生改变时触发
     * 
     * @event
     */
    fileInput.onchange = function () {
        handleFile(this.files[0]);
    };
    
    /**
     * 分割宫格行列数发生变化时触发
     * 
     * @event
     */
    row.onchange = updateRowColumn;
    column.onchange = updateRowColumn;

    function updateRowColumn() {
        var img = previewDiv.getElementsByTagName('img');

        img = img ? img[0] : null;
        handlePiece(img);
    }
    addImg()
}

/**
 * 图片碎片预处理
 * 
 * @param {(string | Image)} source 可以是图片路径或者图片对象
 */
var yangbenimg;
function handlePiece(source) {
    if (!source) {
        return;
    }
    var rowVal =  util.$('row').value;
    var columnVal =  util.$('column').value;
    
    if (typeof source === 'string') {
        var img = new Image();
        
        img.onload = function () {
            yangbenimg=img;
            util.$('result').innerHTML = createPiece(img, rowVal, columnVal);
        };

        img.src = source;
    }
    else {
        util.$('result').innerHTML = createPiece(source, rowVal, columnVal);
    }
}


function euclideandistance(a, b) {
    var sum = 0
    var n
    for (n = 0; n < a.length; n++) {
      sum += Math.pow(a[n] - b[n], 2)
    }
    return sum
  }
var tokenIDs=[170000000,170000001,170000002,170000003,170000004,170000005,170000006,170000007,170000008,170000009,170000010,170000011,170000012,170000013,170000014,170000015,170000016,170000017,170000018,170000019,170000020,170000021,170000022,170000023,170000024,170000025,170000026,170000027,170000028,
    9000000,9000001,9000002,9000003,9000004,9000005,9000006,9000007,9000008,9000009,9000010,9000011,9000012,9000013,9000014,9000015,9000016,9000017,9000018,9000019,9000020,9000021,9000022,9000023,9000024,9000025,9000026,9000027,9000028,9000029,9000030,9000031,9000032,9000033,9000034,9000035,9000036,9000037,9000038,9000039,9000040,9000041,9000042,9000043,9000044,9000045,9000046,9000047,9000048,9000049,9000050,9000051,9000052,9000053,9000054,9000055,9000056,9000057,9000058,9000059,9000060,9000061,9000062,9000063,9000064,9000065,9000066,9000067,9000068,9000069,9000070,9000071,9000072,9000073,9000074,9000075,9000076,9000077,9000078,9000079,9000080,9000081,9000082,9000083,9000084,9000085,9000086,9000087,9000088,9000089,9000090,9000091,9000092,9000093,9000094,9000095,9000096,9000097,9000098,9000099]
var arTimg=[]
/**
 * 生成图片碎片
 * 
 * @param {Image} img 
 * @param {number=} row 分割宫格的行数
 * @param {number=} column 分割宫格的列数
 */
function createPiece(img, row, column) {
    row = util.val(row);
    column = util.val(column);

    var canvas = document.createElement('canvas');
    var ctx = canvas.getContext('2d');

    var wpiece = Math.floor(img.naturalWidth / column);
    var hpiece = Math.floor(img.naturalHeight / row);

    var src = '';
    var html = '';

    canvas.width = wpiece;
    canvas.height = hpiece;
    const colorThief = new ColorThief();
     arTimg=[]

    for (var i = 0; i < row; i++) {
        html += '<tr>';
        
        for (var j = 0; j < column; j++) {
            ctx.drawImage(
                img, 
                j * wpiece, i * hpiece, wpiece, hpiece, 
                0, 0, wpiece, hpiece
            );

            src = canvas.toDataURL();
            html += '<td><img src="' + src + '" /></td>';
            var imgColor = colorThief.getColor(canvas);
            // console.log(imgColor)
            arTimg.push({
                i,
                j,
                imgColor:imgColor
            })

        }
        html += '</tr>';
    }
    html = '<table>' + html + '</table>';
    console.log(arTimg)
    return html;
}




window.onload = initFile;

function Calculatecolor(){
    console.log('Calculatecolor')
    const colorThief = new ColorThief();
    var img=document.querySelector("#artimg")
    // img.crossOrigin = "Anonymous";
    
    var imgColor = colorThief.getColor(img);
    console.log(imgColor)
    var rowVal =  util.$('row').value;
    var columnVal =  util.$('column').value;

     arTimg.forEach((item)=>{
       var minimg = findMinImg(item.imgColor)
       item.minimg = minimg;
       console.log(item)


    })
    var rsult = createImg(yangbenimg,arTimg, rowVal, columnVal);
    console.log(rsult)
    var imglist =  document.querySelector('#imglist');
    var imgR=document.createElement("img");
        imgR.src=rsult;
        
        imglist.append(imgR)
}

function findMinImg(imgColor){
    var imglist =  document.querySelectorAll('#imglist>img');
    var min;
    var minImg;
    const colorThief = new ColorThief();
    imglist.forEach((img)=>{
        var Color = colorThief.getColor(img);
        var flag = euclideandistance(imgColor,Color)
        if(min==undefined){
            min=flag;
            minImg=img;
        }else if(flag<min){
            min=flag;
            minImg=img;

        }
    })
    return minImg;


}

/**
 * 生成图片碎片
 * 
 * @param {Image} img 
 * @param {number=} row 分割宫格的行数
 * @param {number=} column 分割宫格的列数
 */
 function createImg(img,imglist, row, column) {
    row = util.val(row);
    column = util.val(column);

    var canvas = document.createElement('canvas');
    var ctx = canvas.getContext('2d');

    var wpiece = Math.floor(img.naturalWidth / column);
    var hpiece = Math.floor(img.naturalHeight / row);

    var src = '';
    var html = '';

    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    
     

    for (var i = 0; i < row; i++) {
        html += '<tr>';
        
        for (var j = 0; j < column; j++) {
            var img_;
            imglist.forEach((one)=>{
                if(one.i==i&&one.j==j){
                    img_ = one.minimg
                }

            })

            ctx.drawImage(
                img_, 
                j * wpiece, i * hpiece, wpiece, hpiece, 
            );

            ;
        

        }
        
    }
    src = canvas.toDataURL();
     
    return src;
}


function addImg(){
    var imglist =  document.querySelector('#imglist');

    tokenIDs.forEach((item)=>{
        var img=document.createElement("img");
        img.src=`./img/${item}.png`;
        img.width=20
        imglist.append(img)


    })

}
