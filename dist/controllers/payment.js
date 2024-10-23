"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.makePayment = void 0;
const express_1 = __importDefault(require("express"));
const axios_1 = __importDefault(require("axios"));
const crypto_1 = __importDefault(require("crypto"));
const cors_1 = __importDefault(require("cors"));
const uuid_1 = require("uuid");
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)());
const MERCHANT_KEY = "96434309-7796-489d-8924-ab56988a6076";
const MERCHANT_ID = "PGTESTPAYUAT86";
const MERCHANT_BASE_URL = "https://api-preprod.phonepe.com/apis/pg-sandbox/pg/v1/pay";
const MERCHANT_STATUS_URL = "https://api-preprod.phonepe.com/apis/pg-sandbox/pg/v1/status";
const redirectUrl = "http://localhost:8000/status";
const successUrl = "http://localhost:5173/payment-success";
const failureUrl = "http://localhost:5173/payment-failure";
// Payment Controller
const makePayment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, mobileNumber, amount } = req.body;
    const orderId = (0, uuid_1.v4)();
    // Payment Payload
    const paymentPayload = {
        merchantId: MERCHANT_ID,
        merchantUserId: name,
        mobileNumber: mobileNumber,
        amount: amount * 100,
        merchantTransactionId: orderId,
        redirectUrl: `${redirectUrl}/?id=${orderId}`,
        redirectMode: 'POST',
        paymentInstrument: {
            type: 'PAY_PAGE'
        }
    };
    const payload = Buffer.from(JSON.stringify(paymentPayload)).toString('base64');
    const keyIndex = 1;
    const string = payload + '/pg/v1/pay' + MERCHANT_KEY;
    const sha256 = crypto_1.default.createHash('sha256').update(string).digest('hex');
    const checksum = sha256 + '###' + keyIndex;
    const option = {
        method: 'POST',
        url: MERCHANT_BASE_URL,
        headers: {
            accept: 'application/json',
            'Content-Type': 'application/json',
            'X-VERIFY': checksum
        },
        data: {
            request: payload
        }
    };
    try {
        const response = yield axios_1.default.request(option);
        console.log(response.data.data.instrumentResponse.redirectInfo.url);
        return res.status(200).json({ msg: "OK", url: response.data.data.instrumentResponse.redirectInfo.url });
    }
    catch (error) {
        console.log("Error in payment", error);
        return res.status(500).json({ error: 'Failed to initiate payment' });
    }
});
exports.makePayment = makePayment;
// Payment Status Endpoint
app.post('/status', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const merchantTransactionId = req.query.id;
    const keyIndex = 1;
    const string = `/pg/v1/status/${MERCHANT_ID}/${merchantTransactionId}` + MERCHANT_KEY;
    const sha256 = crypto_1.default.createHash('sha256').update(string).digest('hex');
    const checksum = sha256 + '###' + keyIndex;
    const option = {
        method: 'GET',
        url: `${MERCHANT_STATUS_URL}/${MERCHANT_ID}/${merchantTransactionId}`,
        headers: {
            accept: 'application/json',
            'Content-Type': 'application/json',
            'X-VERIFY': checksum,
            'X-MERCHANT-ID': MERCHANT_ID
        },
    };
    try {
        const response = yield axios_1.default.request(option);
        if (response.data.success === true) {
            return res.redirect(successUrl);
        }
        else {
            return res.redirect(failureUrl);
        }
    }
    catch (error) {
        console.error("Error fetching payment status", error);
        return res.status(500).json({ error: 'Failed to retrieve payment status' });
    }
}));
// Start Server
app.listen(8000, () => {
    console.log('Server is running on port 8000');
});
//# sourceMappingURL=payment.js.map