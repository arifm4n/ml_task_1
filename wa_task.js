import { Client } from 'whatsapp-web.js';
import qrcode from 'qrcode-terminal';
import { GoogleGenerativeAI } from "@google/generative-ai"
import dotenv from "dotenv";
dotenv.config();
import readline from "readline";

const genAI = new GoogleGenerativeAI(process.env.API_KEY);

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});


const client = new Client();



client.on('qr', (qr) => {
    // Generate and scan this code with your phone
    qrcode.generate(qr, {small: true});
});

client.on('ready', () => {
    console.log('Client is ready!');
});



client.on('message', async msg => {

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash",systemInstruction: "kamu adalah chatbot. Nama kamu adalah siDapen."});
    const chat = model.startChat({
        history: [
            {"role": "user", "parts": [{text : "Kegiatan sosialisasi manfaat Pasca kerja bagi Pegawai yang memasuki Batas Usia Pensiun (BUP) Tahun 2025 diadakan oleh Departemen Sumber Daya Manusia Bank Indonesia, bertempat di Bali pada tanggal Kamis, 26 September 2024, dengan mengundang pembicara dari internal Bank Indonesia serta Dapenbi, Dapenbi IP, PPBI dan YKKBI.  Kegiatan tersebut dihadiri oleh Pegawai yang akan memasuki BUP Tahun 2025 yang berasal dari seluruh kantor perwakilan Bank Indonesia. Sebagai Pembicara dari Dapenbi adalah Bpk. Tantan Heroika,  Dapenbi IP adalah Bpk. Nanang Hendarsah, PPBI adalah Bpk. M. Dakhlan dan YKKBI adalah Ibu Mubarakah.\n\nKegiatan sosialisasi tersebut berlangsung dengan meriah dimana Peserta sangat antusias menyampaikan pertanyaan antara lain terkait hak dan kewajiban Peserta terutama bagi yang akan memasuki BUP dan bagaimana proses pencairannya. Terkait DAPENBI IP, Peserta juga menanyakan terkait adanya kewajiban pembelian anuitas bagi Peserta yang menerima Manfaat Pensiun (MP) Dapenbi IP jika melebihi  threshold persyaratan sebagaimana ketentuan POJK dan terkait pengelolaan investasi oleh Dapenbi IP."}]},
            {"role": "model", "parts": [{text : "Selamat datang di sahabat DAPEN, ada yang bisa kami bantu? Saya akan memanggil kamu dengan kakak, saya akan menjawab yang saya tau dan jika tidak tahu silakan menghubungi info@dapenbiip.co.id"}]},
    
        ], // Start with an empty history
        generationConfig: {
            maxOutputTokens: 200,
        },
    });

    const result = await chat.sendMessage(msg.body);
    const response = await result.response;
    const text = await response.text();
    

    msg.reply(text);

});

client.initialize();
