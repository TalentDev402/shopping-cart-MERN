import { model, Schema } from "mongoose";
import Tag from "./Tag";

const SettingSchema = new Schema({
  currency: {
    baseCurrency: {
      type: Number,
    },
    currencyList: [
      {
        _id: false,
        name: {
          type: String,
        },
        symbol: {
          type: String,
        },
      },
    ],
    pip: {
      type: Number,
    },
    rates: {
      type: Schema.Types.Mixed,
    },
  },
  companyInfo: {
    name: {
      type: String
    },
    address: {
      type: String
    },
    phone: {
      type: String
    }
  },
  productDisplay: [{
    _id: false,
    title: {
      type: String
    },
    tag: {
      type: Schema.Types.ObjectId,
      ref: Tag
    }
  }],
  theme: {
    type: Number,
    default: 0,
  },
  pages: {
    dashboard: {
      title: {
        type: String
      },
      logo: {
        type: String
      },
      icon: {
        type: String
      },
      banner: {
        type: Array
      }
    },
    newPage: {
      images: [{
        type: String
      }]
    },
    about: {
      text: {
        type: Object
      },
      image: {
        type: String
      }
    },
    membership: {
      text: {
        type: Object
      },
      image: {
        type: String
      }
    },
    deliveryMethod: {
      text: {
        type: Object
      },
      image: {
        type: String
      }
    },
    shippingPaymentTerms: {
      text: {
        type: Object
      },
      image: {
        type: String
      }
    },
    privacyPolicy: {
      text: {
        type: Object
      },
      image: {
        type: String
      }
    },
    returnReplacementPolicy: {
      text: {
        type: Object
      },
      image: {
        type: String
      }
    },
    contact: {
      address: {
        type: String
      },
      email: {
        type: String
      },
      phone: {
        type: String
      },
      image: {
        type: String
      },
      socials: [{
        _id: false,
        type: {
          type: String
        },
        link: {
          type: String
        },
        status: {
          type: Boolean,
          default: false,
        }
      }]
    }
  }
});

const Setting = model("settings", SettingSchema);

export default Setting;
