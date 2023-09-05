// The following is a schema definition for creating invoices for a soccer shop.

export interface Invoice {
    client: Client;
    date?: DateTime;
    items: (LineItem | UnknownText)[];
}

// Ues thi type for answers to invoice questions
export interface Question {
    type: 'question',
    intent: 'asking a question' | 'request task' | 'unknown',
    regarding: 'invoice' | 'invoice processing' | 'others',
    // Only if the input is a question regarding invoice.A question that's being asked related to invoice processing
    query?: string;

}

// Use this type for items that match nothing else
export interface UnknownText {
    type: 'unknown',
    text: string; // The text that wasn't understood
}

export interface LineItem {
    type: 'lineitem',
    product: Product;
    quantity: number;
    price: number;
}

// This can be a DB lookup
export type Product = Shoes | Jerseys | Accessories;

export interface Shoes {
    type: 'Shoes';
    name: 'nike' | 'adidas' | 'puma' | 'mizuno';
    optionSize?: number;
}

export interface Jerseys {
    type: 'Jerseys';
    name: 'miami' | 'italy' | 'spain' | 'brazil' | 'manchester united' | 'manchester city' | 'liverpool' | 'arsenal';
    optionSize?: 'small' | 'medium' | 'large' | 'xlarge';
}

export interface Accessories {
    type: 'Accessories';
    name: 'ball' | 'bag' | 'door' | 'flag' | 'socks';
}

export interface Client {
    type: 'Client';
    name: string
}

export type OptionQuantity = 'no' | 'light' | 'regular' | 'extra' | number;

export interface DateTime {
    type: 'dateTime';
    // a date string of the format MM/DD/YYYY
    date?: string;
}

export type API = {
    // print invoice
    printInvoice(invoice: Invoice): string;
    // answer invoice questions
    answerQuestion(question: Question): string;
}
