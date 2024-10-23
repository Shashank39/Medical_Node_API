import express, { Request, Response } from 'express';
import axios from 'axios';
import crypto from 'crypto';
import cors from 'cors';
import { v4 as uuidv4 } from 'uuid';

const app = express();

app.use(express.json());
app.use(cors());

const MERCHANT_KEY = "96434309-7796-489d-8924-ab56988a6076";
const MERCHANT_ID = "PGTESTPAYUAT86";

const MERCHANT_BASE_URL = "https://api-preprod.phonepe.com/apis/pg-sandbox/pg/v1/pay";
const MERCHANT_STATUS_URL = "https://api-preprod.phonepe.com/apis/pg-sandbox/pg/v1/status";

const redirectUrl = "http://localhost:8000/status";
const successUrl = "http://localhost:5173/payment-success";
const failureUrl = "http://localhost:5173/payment-failure";

// Payment Controller
export const makePayment = async (req: Request, res: Response): Promise<Response> => {
    const { name, mobileNumber, amount } = req.body;
    const orderId = uuidv4();

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
    const sha256 = crypto.createHash('sha256').update(string).digest('hex');
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
        const response = await axios.request(option);
        console.log(response.data.data.instrumentResponse.redirectInfo.url);
        return res.status(200).json({ msg: "OK", url: response.data.data.instrumentResponse.redirectInfo.url });
    } catch (error) {
        console.log("Error in payment", error);
        return res.status(500).json({ error: 'Failed to initiate payment' });
    }
};

// Payment Status Endpoint
app.post('/status', async (req: Request, res: Response) => {
    const merchantTransactionId = req.query.id as string;

    const keyIndex = 1;
    const string = `/pg/v1/status/${MERCHANT_ID}/${merchantTransactionId}` + MERCHANT_KEY;
    const sha256 = crypto.createHash('sha256').update(string).digest('hex');
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
        const response = await axios.request(option);
        if (response.data.success === true) {
            return res.redirect(successUrl);
        } else {
            return res.redirect(failureUrl);
        }
    } catch (error) {
        console.error("Error fetching payment status", error);
        return res.status(500).json({ error: 'Failed to retrieve payment status' });
    }
});

// Start Server
app.listen(8000, () => {
    console.log('Server is running on port 8000');
});
