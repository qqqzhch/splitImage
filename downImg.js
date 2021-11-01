var axios = require('axios')
var fs = require("fs");
var tokenIDs=[9000000,9000001,9000002,9000003,9000004,9000005,9000006,9000007,9000008,9000009,9000010,9000011,9000012,9000013,9000014,9000015,9000016,9000017,9000018,9000019,9000020,9000021,9000022,9000023,9000024,9000025,9000026,9000027,9000028,9000029,9000030,9000031,9000032,9000033,9000034,9000035,9000036,9000037,9000038,9000039,9000040,9000041,9000042,9000043,9000044,9000045,9000046,9000047,9000048,9000049,9000050,9000051,9000052,9000053,9000054,9000055,9000056,9000057,9000058,9000059,9000060,9000061,9000062,9000063,9000064,9000065,9000066,9000067,9000068,9000069,9000070,9000071,9000072,9000073,9000074,9000075,9000076,9000077,9000078,9000079,9000080,9000081,9000082,9000083,9000084,9000085,9000086,9000087,9000088,9000089,9000090,9000091,9000092,9000093,9000094,9000095,9000096,9000097,9000098,9000099

]
var i=0;
function getImg(){
    console.log(i)
    var id = tokenIDs[i]
    axios({
        url: `https://www.artblocks.io/_next/image?url=https%3A%2F%2Fartblocks-mainnet.s3.amazonaws.com%2F${id}.png&w=750&q=7`,
        headers: {
            'Content-Type': 'multipart/form-data',
        },
        responseType: 'arraybuffer'
    })
        .then(function (response) {
            // handle success
            console.log(response.data);
            fs.writeFileSync(`./img/${id}.png`, response.data, 'utf-8')
            i++;
            getImg()
        })

}

getImg()