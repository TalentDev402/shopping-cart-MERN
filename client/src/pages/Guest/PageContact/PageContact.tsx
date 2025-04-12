import { FC, useState } from "react";
import SocialsList from "components/Guest/shared/SocialsList/SocialsList";
import Label from "components/Guest/utils/Label/Label";
import Input from "components/Guest/shared/Input/Input";
import Textarea from "components/Guest/shared/Textarea/Textarea";
import ButtonPrimary from "components/Guest/shared/Button/ButtonPrimary";
import { useSelector } from "react-redux";
import { RootState } from "store";
import { apis } from "apis";
import toast from "react-hot-toast";

export interface PageContactProps {
  className?: string;
}

const PageContact: FC<PageContactProps> = ({ className = "" }) => {
  const { pages } = useSelector((state: RootState) => state.setting);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const SendMessage = async (event: any) => {
    try {
      event.preventDefault();
      const response: any = await apis.ContactUs(formData);
      if (response.status) {
        toast.success(response.message);
        setFormData({
          name: "",
          email: "",
          message: "",
        });
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message);
    }
  };

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  return (
    <div
      className={`nc-PageContact overflow-hidden ${className}`}
      data-nc-id="PageContact"
    >
      <div className="">
        <h2 className="my-20 flex items-center text-3xl leading-[115%] md:text-5xl md:leading-[115%] font-semibold text-neutral-900 dark:text-neutral-100 justify-center">
          Contact
        </h2>
        <div className="container max-w-7xl mx-auto">
          <div className="flex-shrink-0 grid grid-cols-1 md:grid-cols-2 gap-12 ">
            <div className="max-w-sm space-y-8">
              <div>
                <h3 className="uppercase font-semibold text-sm dark:text-neutral-200 tracking-wider">
                  🗺 ADDRESS
                </h3>
                <span className="block mt-2 text-neutral-500 dark:text-neutral-400">
                  {pages && pages.contact ? pages.contact.address : ""}
                </span>
              </div>

              <div>
                <h3 className="uppercase font-semibold text-sm dark:text-neutral-200 tracking-wider">
                  💌 EMAIL
                </h3>
                <span className="block mt-2 text-neutral-500 dark:text-neutral-400">
                  {pages && pages.contact ? pages.contact.email : ""}
                </span>
              </div>

              <div>
                <h3 className="uppercase font-semibold text-sm dark:text-neutral-200 tracking-wider">
                  ☎ PHONE
                </h3>
                <span className="block mt-2 text-neutral-500 dark:text-neutral-400">
                  {pages && pages.contact ? pages.contact.phone : ""}
                </span>
              </div>
              <div>
                <h3 className="uppercase font-semibold text-sm dark:text-neutral-200 tracking-wider">
                  🌏 SOCIALS
                </h3>
                {pages && pages.contact ? (
                  <SocialsList
                    className="mt-2"
                    socials={pages.contact.socials}
                  />
                ) : null}
              </div>
            </div>
            <div>
              <form
                className="grid grid-cols-1 gap-6"
                onSubmit={SendMessage}
                method="post"
              >
                <label className="block">
                  <Label>Full name</Label>

                  <Input
                    type="text"
                    className="mt-1"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                  />
                </label>
                <label className="block">
                  <Label>Email address</Label>

                  <Input
                    type="email"
                    className="mt-1"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                  />
                </label>
                <label className="block">
                  <Label>Message</Label>

                  <Textarea
                    className="mt-1"
                    rows={6}
                    required
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                  />
                </label>
                <div>
                  <ButtonPrimary type="submit">Send Message</ButtonPrimary>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* OTHER SECTIONS */}
      {pages && pages.contact && pages.contact.image ? (
        <div className="my-5 lg:my-20 w-full px-4 xl:px-28">
          <img
            src={`${process.env.REACT_APP_SERVER_URL}/${pages.contact.image}`}
            width="100%"
            className="object-cover"
          />
        </div>
      ) : (
        <div className="mt-3"></div>
      )}
    </div>
  );
};

export default PageContact;
