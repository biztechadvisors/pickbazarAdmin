import React, { useState, ChangeEvent, FormEvent } from 'react';
import * as XLSX from 'xlsx';
// import { GetProductDetails } from '../../../../services'; // Update import path based on your project structure
import swal from 'sweetalert';
// import NotificationManager from 'react-notifications/lib/NotificationManager';

interface Variant {
    productName: string;
    slug: string;
    // Add other variant properties here
}

interface Product {
    id: string;
    categoryName: string;
    subCategoryName: string;
    name: string;
    slug: string;
    brandId: string;
    status: string;
    desc: string;
    photo: string;
    productVariants: Variant[];
    HighLightDetail: any[]; // Change the type accordingly
    ShippingDays: string;
    PubilshStatus: string;
}

const UploadProdxl: React.FC = () => {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [uploadResult, setUploadResult] = useState<any[]>([]);
    const [selectedFileName, setSelectedFileName] = useState<string>('');

    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setSelectedFile(file);
            setSelectedFileName(file.name);
        }
    };

    const convertToSlug = (text: string): string => {
        return text
            .toString()
            .toLowerCase()
            .replace(/\s+/g, '-')
            .replace(/[^\w\-]+/g, '')
            .replace(/\-\-+/g, '-')
            .replace(/^-+/, '')
            .replace(/-+$/, '');
    };

    const convertExcelToJson = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
    
            reader.onload = (e) => {
                try {
                    const data = new Uint8Array(e.target?.result as ArrayBuffer);
                    const workbook = XLSX.read(data, { type: 'array' });
                    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    
                    if (!worksheet) {
                        reject(new Error('Invalid worksheet data.'));
                        return;
                    }
    
                    const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
                    
                    if (!Array.isArray(jsonData) || jsonData.length === 0) {
                        reject(new Error('Invalid JSON data.'));
                        return;
                    }
    
                    const headerRow = jsonData[0] as string[];
    
                    const rows = jsonData.slice(1);

                    const products: { [key: string]: Product } = {};

                    rows.forEach((row: any) => {
                        if (headerRow.length === 0 || row.length === 0) {
                            return;
                        }
    
                        const productType = row[headerRow.indexOf('productType')];
    
                        if (productType === 'variant' || productType === 'Variant') {
                            const parentId = row[headerRow.indexOf('parentId')];
    
                            if (!parentId || !products[parentId]) {
                                reject(new Error(`Invalid parent ID ${parentId} for variant.`));
                                return;
                            }
    
                            const variant: Variant = {
                                productName: row[headerRow.indexOf('productName')],
                                slug: convertToSlug(row[headerRow.indexOf('productName')]),
                                // Add other variant properties here
                            };
    
                            products[parentId].productVariants.push(variant);
                        } else if (productType === 'main' || productType === 'Main') {
                            const productId = row[headerRow.indexOf('id')];
    
                            const product: Product = {
                                id: productId,
                                categoryName: row[headerRow.indexOf('categoryName')],
                                subCategoryName: row[headerRow.indexOf('subCategoryName')],
                                name: row[headerRow.indexOf('productName')],
                                slug: convertToSlug(row[headerRow.indexOf('productName')]),
                                brandId: row[headerRow.indexOf('Featured Product')],
                                status: row[headerRow.indexOf('status')],
                                desc: row[headerRow.indexOf('desc')],
                                photo: row[headerRow.indexOf('photo')],
                                productVariants: [],
                                HighLightDetail: [],
                                ShippingDays: row[headerRow.indexOf('ShippingDays')],
                                PubilshStatus: row[headerRow.indexOf('PublishedStatus')],
                            };
    
                            products[productId] = product;
                            
                        }
                    });
    
                    const finalProducts = Object.values(products);
    
                    resolve(JSON.stringify(finalProducts, null, 2));
                } catch (error) {
                    reject(error);
                }
            };
    
            reader.readAsArrayBuffer(file);
        });
    };

    const handleFormSubmit = async (event: FormEvent) => {
        event.preventDefault();

        if (selectedFile) {
            try {
                swal({
                    title: 'Are you sure?',
                    text: "You want to Upload Product's",
                    icon: 'warning',
                    buttons: true as any, 
                    dangerMode: true,
                }).then(async (success) => {
                    if (success) {
                        const jsonData = await convertExcelToJson(selectedFile);
                        // console.log("json of excel",jsonData)
                        // const response = await GetProductDetails.uploadProductList(jsonData);
                        // if (response) {
                        //     NotificationManager.success(response.message, 'Product Successfully Uploaded');
                        //     setUploadResult([response.data]);
                        //     setSelectedFile(null);
                        //     setSelectedFileName('');
                        // }
                    } else {
                        // this.setState({ isLoaded: false }); // I assume you don't need this line in TypeScript
                    }
                });
            } catch (error) {
                console.error(error);
            }
        }
    };

    return (
        <div>
            <div className="upload-container">
                <h3 className="upload-title">Upload Products Excel File</h3>
                <div className="upload-form">
                    <form onSubmit={handleFormSubmit}>
                        <label htmlFor="file-upload" className="upload-input-label">
                            <input
                                id="file-upload"
                                type="file"
                                onChange={handleFileChange}
                                className="upload-input"
                                accept=".xlsx, .xls"
                                multiple={false}
                            />
                            <span className="input-text">Choose File</span>
                        </label>
                        <br />
                        <button type="submit" className="upload-button">
                            Upload
                        </button>
                    </form>
                    {selectedFileName && (
                        <p className="selected-file-name">Selected File: {selectedFileName}</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default UploadProdxl;
