import SignInForm from "./SignInForm";
import SignUpForm from "./SignUpForm";
import {ReactElement} from "react";
import ForgotPasswordForm from "./ForgotPasswordForm";



interface MapperType {
    SignIn: ReactElement,
    SignUp: ReactElement,
    ForgotPassword: ReactElement
}

const typeMapper:MapperType = {
    SignIn: <SignInForm/>,
    SignUp: <SignUpForm/>,
    ForgotPassword: <ForgotPasswordForm/>
}


export default function AuthForm({authModalState}: AuthContext) {
    const {isOpen, authFormType} = authModalState;
    if (!isOpen) return null;

    return typeMapper[authFormType ?? 'SignIn'];
}
