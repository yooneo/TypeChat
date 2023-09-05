import fs from "fs";
import path from "path";
import dotenv from "dotenv";
import {
    createLanguageModel,
    processRequests,
    createProgramTranslator,
    getData,
    evaluateJsonProgram
} from "typechat";
import {Invoice, Question} from "./soccerShopSchema";

// TODO: use local .env file.
dotenv.config({path: path.join(__dirname, "../../../.env")});

const model = createLanguageModel(process.env);
const schema = fs.readFileSync(path.join(__dirname, "soccerShopSchema.ts"), "utf8");
// const translator = createJsonTranslator<Invoice>(model, schema, "Invoice");
const translator = createProgramTranslator(model, schema);

function printInvoice(invoice: Invoice) {
    console.log(`Printing invoice to ${invoice.client.name}...`);
}

function answerQuestion(question: Question) {
    if (question.intent !== "asking a question") {
        console.log(`${question.query} is not a question`);
        return;
    }
    if (question.regarding === "invoice" || question.regarding === "invoice processing") {
        console.log(`Answering question: ${question.query}`);
    } else
        console.log(`I only know about invoice. I cannot answer: ${question.query}`);
}

// Process requests interactively or from the input file specified on the command line
processRequests("QB Assistant> ", process.argv[2], async (request) => {
    let message = `${request}\n\ncontext:\ntoday is ${new Date().toLocaleDateString()}`;
    const response = await translator.translate(message);
    if (!response.success) {
        console.log(response.message);
        return;
    }
    const program = response.data;
    console.log(getData(translator.validator.createModuleTextFromJson(program)));
    console.log("Running program:");
    const result = await evaluateJsonProgram(program, handleCall);
    if (result !== undefined)
        console.log(result);
    /*
    const invoice = response.data;
    console.log(JSON.stringify(invoice, undefined, 2));
    if (invoice.items.some(item => item.type === "unknown")) {
        console.log("I didn't understand the following:");
        for (const item of invoice.items) {
            if (item.type === "unknown") console.log(item.text);
        }
        console.log("Can you tell me more?")
        return;
    }
    generateInvoice(invoice);
    printInvoice(invoice);
    console.log("Success!");

     */
});

async function handleCall(func: string, args: any[]): Promise<unknown> {
    console.log(`${func}(${args.map(arg => typeof arg === "number" ? arg : JSON.stringify(arg, undefined, 2)).join(", ")})`);
    switch (func) {
        case "printInvoice":
            return printInvoice(args[0]);
        case "answerQuestion":
            return answerQuestion(args[0]);
    }
    return NaN;
}
