//  ######  CustomLink  ######## //
export interface CustomLink {
  label: string;
  href: string;
  targetBlank?: boolean;
}

export type TwMainColor =
  | "pink"
  | "green"
  | "yellow"
  | "red"
  | "indigo"
  | "blue"
  | "purple"
  | "gray";

//

export interface IRouteType {
  key: string;
  path: string;
  element: React.ReactNode;
  isSuper?: boolean;
}

export type IUser = {
  _id: string;
  email: string;
  avatar: string | null | undefined;
  firstName: string;
  lastName: string;
  role: string;
  status: boolean;
};

export type ICustomer = {
  _id: string;
  email: string;
  name: string;
  points: number;
  phone: string;
  address: string;
}

export type ISupplier = {
  _id: string;
  name: string;
  contactName: string;
  email: string;
  phone: string;
  businessNumber: string;
  logo: string | null | undefined;
  bankInfo: {
    bankName: string;
    branch: string;
    accountNumber: string;
    accountName: string;
  };
  address: {
    country: string;
    address: string;
    zipCode: string;
  };
  website: string;
  remarks: {
    type: "TEXT" | "FILE";
    content: string | null | undefined;
  };
  status: boolean;
};

export type ITag = {
  _id: string;
  name: string;
};

export type IProduct = {
  _id: string;
  itemNo: string;
  name: string;
  description: string;
  photo: string;
  quantity: number;
  alertQuantity: number;
  supplier: any;
  purchasePrice: number;
  sellingPrice: number;
  tags: Array<ITag>;
  status: boolean;
  category: any;
  thumbnails: Array<string>;
};

export type IAdjustment = {
  _id: string;
  adjustmentId: number;
  product: IProduct;
  reason: string;
  quantity: number;
  cratedAt: string;
}

type IOrderItem = {
  product: {
    name: string;
    photo: string
  },
  quantity: number;
  pricePerItem: number
}

export type IOrder = {
  _id: string;
  orderId: number;
  customer: {
    name: string;
    email: string;
  },
  contactInfo: {
    phone: string;
    email: string;
  },
  orderStatus: string,
  paymentStatus: string,
  orderTrackStatus: string,
  shippingAddress: string,
  paymentMethod: string,
  transactionId: string,
  items: Array<IOrderItem>,
  fee: number,
  createdAt: string;
}

export type IRequest = {
  _id: string;
  requestId: number;
  order: IOrder;
  customer: {
    name: string;
    email: string;
    phone: string;
  };
  returnReason: string;
  status: string;
  createdAt: string;
}
