import fetch from 'cross-fetch';
import crypto from 'crypto';
import dotenv from 'dotenv';

dotenv.config();
const { API_KEY='', CHAT_URL='' } = process.env;


export async function getXfMessage (msg:string) {
  let time = Date.now().toString();
  let sign = getSign(time);
  try {
    let res = await fetch(CHAT_URL, {
      headers: {
        time, sign
      },
      method: 'POST',
      body: JSON.stringify({time, msg})
    });
    let { code, data: { text, message } } = await res.json();

    if(code==200){
      return text;
    }else{
      return message;
    }

  }catch(e:any) {
    return e?.message;
  }
  
}

function getSign (time:string) {
  return md5(API_KEY + time).toUpperCase();
}

function md5(data:string) {
  const md5 = crypto.createHash('md5');
  return md5.update(data).digest('hex');
}