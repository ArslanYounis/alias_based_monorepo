// Owner information
export interface Owner {
    ownerId: string;
    ownerNameE: string;
    ownerNameA: string;
}

// Plot information
export interface Plot {
    plotId: string;
    plotNumber: string;
}

// Step / workflow information
export interface Step {
    stepConst: string;
    status: number;
    actionDate: string;
    actionUser?: {
        userNameE: string;
        userNameA: string;
    };
}

// Document attachment
export interface Attachment {
    downloadUrl: string;
}

// Document information
export interface DocumentItem {
    documentNameE: string;
    documentNameA: string;
    attachmentList: Attachment[];
}

// Application information
export interface Application {
    applicationNumber: string;
    applicationCreatedDate: string;
    applicationReferenceNumber: string;
}

// Full API response
export interface ApplicationDetails {
    result: {
        application: Application;
        owners: Owner[];
        plot: Plot;
        steps: Step[];
        documents: DocumentItem[];
    };
}
