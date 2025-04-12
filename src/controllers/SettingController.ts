import { Request, Response } from "express";
import Setting from "../models/Setting";
import axios from "axios";
import fs from "fs";
import path from "path";
import multer from "multer";

const NewPagePhotoStorage = multer.diskStorage({
  destination: "./public/img/",
  filename: (req, file, cb) => {
    cb(null, "news-" + Date.now() + path.extname(file.originalname));
  },
});

const UploadNewPagePhoto = multer({
  storage: NewPagePhotoStorage,
  limits: { fileSize: 150 * 1024 * 1024 },
}).single("file");

export const UploadPhoto = async (req: any, res: any) => {
  UploadNewPagePhoto(req, res, () => {
    try {
      return res.status(200).json({
        success: true,
        path: "img/" + req.file?.filename,
      });
    } catch (err) {
      return res.status(500).json({ message: "File uploading error!" });
    }
  });
};
const GetExchangeRateForHKD = async () => {
  try {
    const url =
      process.env.EXCHANGERATE_ENDPOINT +
      `?access_key=${process.env.EXCHANGERATE_ACCESS_KEY}&base=HKD`;
    const response: any = await axios.post(url);
    const setting: any = await Setting.findOne();
    if (setting) {
      const currency = {
        ...setting.currency,
        rates: response.data.rates,
      };
      await Setting.findByIdAndUpdate(setting._id, { currency: currency });
    }
  } catch (err) {
    console.log(err);
  }
};

const CreateInitialSetting = async () => {
  try {
    const setting = await Setting.findOne();
    if (!setting) {
      const initialSetting = new Setting({
        currency: {
          baseCurrency: 0,
          currencyList: [
            {
              name: "HKD",
              symbol: "$",
            },
          ],
        },
      });

      await initialSetting.save();
      await GetExchangeRateForHKD();
    }
  } catch (err) {
    console.log(err);
  }
};

const GetCompanyInfo = async (req: Request, res: Response) => {
  try {
    const setting = await Setting.findOne();
    return res.status(200).json({
      success: true,
      companyInfo: setting?.companyInfo,
    });
  } catch (err) {
    console.log(err);
    return res.status(501).json({ message: "Internal server error" });
  }
};

const GetProductDisplay = async (req: Request, res: Response) => {
  try {
    const setting = await Setting.findOne().populate([
      { path: "productDisplay.tag" },
    ]);
    return res.status(200).json({
      success: true,
      productDisplay: setting?.productDisplay,
    });
  } catch (err) {
    console.log(err);
    return res.status(501).json({ message: "Internal server error" });
  }
};

const SaveCompanyInfo = async (req: Request, res: Response) => {
  try {
    const data = req.body;
    const updatedSetting = await Setting.findOneAndUpdate(
      {},
      { companyInfo: data },
      { new: true }
    );
    return res.status(200).json({
      success: true,
      companyInfo: updatedSetting?.companyInfo,
    });
  } catch (err) {
    console.log(err);
    return res.status(501).json({ message: "Internal server error" });
  }
};

const GetSetting = async (req: Request, res: Response) => {
  try {
    const setting = await Setting.findOne().populate([
      { path: "productDisplay.tag" },
    ]);
    return res.status(200).json({
      success: true,
      setting: {
        currency: setting?.currency,
        theme: setting?.theme,
        companyInfo: setting?.companyInfo,
        productDisplay: setting?.productDisplay,
        pages: setting?.pages,
      },
    });
  } catch (err) {
    console.log(err);
    return res.status(501).json({ message: "Internal server error" });
  }
};

const CreateCurrency = async (req: Request, res: Response) => {
  try {
    const { name, symbol } = req.body;
    const setting: any = await Setting.findOne();
    let currencyList = setting.currency.currencyList;
    const currency = {
      ...setting.currency,
      currencyList: [...currencyList, { name: name, symbol: symbol }],
    };

    const updatedSetting = await Setting.findByIdAndUpdate(
      setting._id,
      { currency: currency },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      currency: updatedSetting?.currency,
    });
  } catch (err) {
    console.log(err);
    return res.status(501).json({ message: "Internal server error" });
  }
};

const DeleteCurrency = async (req: Request, res: Response) => {
  try {
    const { currency } = req.query;
    const setting: any = await Setting.findOne();
    let currencyList = setting.currency.currencyList;
    const updatedCurrencyList = currencyList.filter(
      (c: any) => c.name !== currency
    );

    const updatedSetting = await Setting.findByIdAndUpdate(
      setting._id,
      { currency: { ...setting.currency, currencyList: updatedCurrencyList } },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      currency: updatedSetting?.currency,
    });
  } catch (err) {
    console.log(err);
    return res.status(501).json({ message: "Internal server error" });
  }
};

const SetBaseCurrency = async (req: Request, res: Response) => {
  try {
    const { currency } = req.body;
    const setting: any = await Setting.findOne();
    const newCurrency = {
      ...setting.currency,
      baseCurrency: Number(currency),
    };

    const updatedSetting = await Setting.findByIdAndUpdate(
      setting._id,
      { currency: newCurrency },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      currency: updatedSetting?.currency,
    });
  } catch (err) {
    console.log(err);
    return res.status(501).json({ message: "Internal server error" });
  }
};

const CreateProductDisplay = async (req: Request, res: Response) => {
  try {
    const { title, tag } = req.body;
    const setting: any = await Setting.findOne();
    const productDisplay = [
      ...setting.productDisplay,
      { title: title, tag: tag },
    ];

    const updatedSetting = await Setting.findByIdAndUpdate(
      setting._id,
      { productDisplay: productDisplay },
      { new: true }
    ).populate([{ path: "productDisplay.tag" }]);

    return res.status(200).json({
      success: true,
      productDisplay: updatedSetting?.productDisplay,
    });
  } catch (err) {
    console.log(err);
    return res.status(501).json({ message: "Internal server error" });
  }
};

const UpdateProductDisplay = async (req: Request, res: Response) => {
  try {
    const { title, tag, index } = req.body;
    const setting: any = await Setting.findOne();
    const productDisplay = setting.productDisplay.map(
      (productDisplay: any, i: number) => {
        if (i === Number(index)) {
          return {
            title: title,
            tag: tag,
          };
        } else return productDisplay;
      }
    );

    const updatedSetting = await Setting.findByIdAndUpdate(
      setting._id,
      { productDisplay: productDisplay },
      { new: true }
    ).populate([{ path: "productDisplay.tag" }]);

    return res.status(200).json({
      success: true,
      productDisplay: updatedSetting?.productDisplay,
    });
  } catch (err) {
    console.log(err);
    return res.status(501).json({ message: "Internal server error" });
  }
};

const DeleteProductDisplay = async (req: Request, res: Response) => {
  try {
    const { index } = req.params;
    const setting: any = await Setting.findOne();
    const productDisplay = setting.productDisplay.filter(
      (_: any, i: number) => i !== Number(index)
    );

    const updatedSetting = await Setting.findByIdAndUpdate(
      setting._id,
      { productDisplay: productDisplay },
      { new: true }
    ).populate([{ path: "productDisplay.tag" }]);

    return res.status(200).json({
      success: true,
      productDisplay: updatedSetting?.productDisplay,
    });
  } catch (err) {
    console.log(err);
    return res.status(501).json({ message: "Internal server error" });
  }
};

const PageImageStorage = multer.diskStorage({
  destination: "./public/img/",
  filename: (req, file, cb) => {
    cb(null, "page-" + Date.now() + path.extname(file.originalname));
  },
});

const UploadPageImage = multer({
  storage: PageImageStorage,
  limits: { fileSize: 150 * 1024 * 1024 },
}).single("file");

export const UploadImage = async (req: any, res: any) => {
  UploadPageImage(req, res, () => {
    try {
      return res.status(200).json({
        success: true,
        path: "img/" + req.file?.filename,
      });
    } catch (err) {
      return res.status(500).json({ message: "File uploading error!" });
    }
  });
};

const SavePages = async (req: Request, res: Response) => {
  try {
    const data = req.body;
    const setting: any = await Setting.findOne();
    let pages: any;
    if (
      data.page === "about" ||
      data.page === "membership" ||
      data.page === "shippingPaymentTerms" ||
      data.page === "deliveryMethod" ||
      data.page === "returnReplacementPolicy" ||
      data.page === "privacyPolicy"
    ) {
      let image = setting.pages[data.page].image;
      if (data.image == -1) {
        data.image = image;
      } else if (data.image && image) {
        const filePath = "public/" + image;
        if (fs.existsSync(filePath)) {
          fs.unlink(filePath, (err) => {
            if (err) throw err;
          });
        }
      }

      pages = {
        ...setting.pages,
        [data.page]: {
          text: data.text,
          image: data.image,
        },
      };
    } else if(data.page === "dashboard"){
      let logo = setting.pages[data.page].logo;
      if (data.logo == -1){
        data.logo = logo;
      }
      else if (data.logo && logo) {
        const filePath = "public/" + logo;
        if (fs.existsSync(filePath)) {
          fs.unlink(filePath, (err) => {
            if (err) throw err;
          });
        }
      }
      
      let icon = setting.pages[data.page].icon;
      if (data.icon == -1){
        data.icon = icon;
      }
      else if (data.icon && icon) {
        const filePath = "public/" + icon;
        if (fs.existsSync(filePath)) {
          fs.unlink(filePath, (err) => {
            if (err) throw err;
          });
        }
      }

      let banner = setting.pages[data.page].banner;
      if (data.banner == -1){
        data.banner = banner;
      }
      else if (data.banner && banner) {
        // data.banner.forEach((ban: string) => {
        //   const filePath = "public/" + ban;
        //   if (fs.existsSync(filePath)) {
        //     fs.unlink(filePath, (err) => {
        //       if (err) throw err;
        //     });
        //   }
        // });
      }

      pages = {
        ...setting.pages,
        [data.page]: {
          title: data.title,
          logo: data.logo,
          icon: data.icon,
          banner: data.banner
        }
      }
    } else if (data.page === "contact") {
      if (data.image && setting.pages.contact.image) {
        const filePath = "public/" + setting.pages.contact.image;
        if (fs.existsSync(filePath)) {
          fs.unlink(filePath, (err) => {
            if (err) throw err;
          });
        }
      }

      let socials: any = [...setting.pages.contact.socials];
      let index = socials.findIndex(
        (social: any) => social.type === "facebook"
      );
      if (index !== -1) {
        socials[index] = {
          type: "facebook",
          link: data.facebook,
          status: data.facebookStatus,
        };
      } else {
        socials.push({
          type: "facebook",
          link: data.facebook,
          status: data.facebookStatus,
        });
      }

      index = socials.findIndex((social: any) => social.type === "instagram");
      if (index !== -1) {
        socials[index] = {
          type: "instagram",
          link: data.instagram,
          status: data.instagramStatus,
        };
      } else {
        socials.push({
          type: "instagram",
          link: data.instagram,
          status: data.instagramStatus,
        });
      }

      index = socials.findIndex((social: any) => social.type === "whatsapp");
      if (index !== -1) {
        socials[index] = {
          type: "whatsapp",
          link: data.whatsapp,
          status: data.whatsappStatus,
        };
      } else {
        socials.push({
          type: "whatsapp",
          link: data.whatsapp,
          status: data.whatsappStatus,
        });
      }

      pages = {
        ...setting.pages,
        contact: {
          address: data.address,
          email: data.email,
          phone: data.phone,
          image: data.image ? data.image : setting.pages.contact.image,
          socials: socials,
        },
      };
    } else if (data.page === "newPage") {
      let images = setting.pages[data.page].images;
      if (data.images == -1) {
        data.images = images;
      }
      pages = {
        ...setting.pages,
        newPage: {
          images: data.images,
        },
      };
    }

    const updatedSetting = await Setting.findByIdAndUpdate(
      setting._id,
      { pages: pages },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      pages: updatedSetting?.pages,
    });
  } catch (err) {
    console.log(err);
    return res.status(501).json({ message: "Internal server error" });
  }
};

const GetPages = async (req: Request, res: Response) => {
  try {
    const setting: any = await Setting.findOne();
    let socials = setting.pages.contact.socials.filter(
      (social: any) => social.status === true && social.link !== ""
    );
    return res.status(200).json({
      success: true,
      pages: {
        ...setting?.pages,
        contact: {
          ...setting?.pages.contact,
          socials: socials,
        },
      },
    });
  } catch (err) {
    console.log(err);
    return res.status(501).json({ message: "Internal server error" });
  }
};

export const SettingController = {
  CreateInitialSetting,
  GetSetting,
  GetCompanyInfo,
  SaveCompanyInfo,
  CreateCurrency,
  DeleteCurrency,
  UploadPhoto,
  SetBaseCurrency,
  GetExchangeRateForHKD,
  GetProductDisplay,
  CreateProductDisplay,
  UpdateProductDisplay,
  DeleteProductDisplay,
  SavePages,
  UploadImage,
  GetPages,
};
