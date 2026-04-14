const express = require('express');
const path = require('path');
const pino = require('pino');
const { default: makeWASocket, useMultiFileAuthState, delay } = require("@whiskeysockets/baileys");

const app = express();
app.use(express.static('public'));

app.get('/pair', async (req, res) => {
    let phone = req.query.phone;
    if (!phone) return res.json({ error: "නම්බර් එක ගහන්න!" });

    try {
        const { state } = await useMultiFileAuthState('./session');
        const sock = makeWASocket({
            auth: state,
            logger: pino({ level: "silent" })
        });

        if (!sock.authState.creds.registered) {
            await delay(2000);
            let code = await sock.requestPairingCode(phone);
            res.json({ code: code });
        }
    } catch (err) {
        res.json({ error: "Error එකක් ආවා!" });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));

