import { useGoogleLogin } from "@react-oauth/google";
import googleSvg from "assets/images/Google.svg";
import { apis } from "apis";
import { useNavigate } from "react-router-dom";
import { store } from "store";
import toast from "react-hot-toast";
import { signInSuccess } from "store/slices/authSlice";

const GoogleLogin = () => {
    const navigate = useNavigate();

    const login = useGoogleLogin({
        flow: "implicit",
        onSuccess: async (tokenResponse) => {
            try {
                const response: any = await apis.CustomerGoogleAuth({ token: tokenResponse.access_token })
                if (response.token) {
                    navigate("/");
                    store.dispatch(signInSuccess(response.token));
                    toast.success(response.message);
                }
            } catch (err) {
                console.warn(err);
            }
        },
        onError: (errorResponse) => console.warn(errorResponse),
    });

    return (
        <button
            onClick={() => login()}
            className=" flex w-full rounded-lg bg-primary-50 dark:bg-neutral-800 px-4 py-3 transform transition-transform sm:px-6 hover:translate-y-[-2px]"
        >
            <img
                className="flex-shrink-0"
                src={googleSvg}
                alt={"Google"}
            />
            <h3 className="flex-grow text-center text-sm font-medium text-neutral-700 dark:text-neutral-300 sm:text-sm">
                Continue with Google
            </h3>
        </button>
    )
}

export default GoogleLogin;