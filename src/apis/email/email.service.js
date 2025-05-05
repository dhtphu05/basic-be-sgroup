import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth:{
        user: process.env.EMAIL_USER,
        pass: process.env.SMTP_PASSWORD
    }

})

export const sendResetPasswordEmail = async( email, resetLink)=>{
    try{
        const mailOptions={
            from: `"SGroup Training" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: 'Yêu cầu đặt lại mật khẩu',
            html: `
                <h1>Đặt lại mật khẩu</h1>
                <p>Bạn nhận được email này vì bạn (hoặc ai đó) đã yêu cầu đặt lại mật khẩu cho tài khoản của bạn.</p>
                <p>Vui lòng nhấn vào đường dẫn dưới đây để đặt lại mật khẩu của bạn:</p>
                <a href="${resetLink}" style="padding: 10px 15px; background-color: #4CAF50; color: white; text-decoration: none; border-radius: 4px;">
                    Đặt lại mật khẩu
                </a>
                <p>Nếu bạn không yêu cầu đặt lại mật khẩu, vui lòng bỏ qua email này.</p>
                <p>Lưu ý: Liên kết này sẽ hết hạn sau 1 giờ.</p>
            `
        }
        //send mail
        const info= await transporter.sendMail(mailOptions);
        console.log('Email sent:', info.response);
        return info;
    }
    catch(error){
        console.error('Error sending email:', error);
        throw new Error('Failed to send email');
    }
}

