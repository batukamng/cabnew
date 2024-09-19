package com.mram.service.core;

import com.mram.model.audit.MailProperties;
import freemarker.template.Configuration;
import freemarker.template.Template;
import jakarta.mail.Message;
import jakarta.mail.Session;
import jakarta.mail.Transport;
import jakarta.mail.internet.InternetAddress;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.ui.freemarker.FreeMarkerTemplateUtils;

import java.util.HashMap;
import java.util.Map;
import java.util.Properties;
import java.util.logging.Level;
import java.util.logging.Logger;

@Service
public class SendingMailService {
    private final MailProperties mailProperties;
    private final Configuration templates;

    @Autowired
    SendingMailService(MailProperties mailProperties, Configuration templates) {
        this.mailProperties = mailProperties;
        this.templates = templates;
    }

    public boolean sendVerificationMail(String toEmail, String verificationCode, String toUsername) {
        String subject = "Please verify your email";
        String body = "";
        try {
            Template t = templates.getTemplate("email-verification.ftl");
            Map<String, String> map = new HashMap<>();
            map.put("VERIFICATION_URL", mailProperties.getVerificationapi() + verificationCode);
            map.put("Username", toUsername);
            body = FreeMarkerTemplateUtils.processTemplateIntoString(t, map);
        } catch (Exception ex) {
            subject = "";
            body = "";
            toEmail = "";
            // Logger.getLogger(this.getClass().getName()).log(Level.SEVERE,
            // ex.getMessage(), ex);
        }
        return sendMail(toEmail, subject, body);
    }

    public boolean sendMail(String toEmail, String subject, String body) {
        try {
            Properties props = System.getProperties();
            props.put("mail.smtp.ssl.enable", "true");

            Session session = Session.getDefaultInstance(props);
            session.setDebug(true);

            MimeMessage msg = new MimeMessage(session);
            // MimeMessageHelper helper = new MimeMessageHelper(msg, true, "UTF-8");
            InternetAddress from = new InternetAddress();
            from.setAddress(mailProperties.getFrom());
            from.setPersonal("ЗГХЭГ", "UTF-8");
            // msg.setFrom(new InternetAddress(mailProperties.getFrom(),
            // mailProperties.getFromName()));
            msg.setFrom(from);
            msg.setRecipient(Message.RecipientType.TO, new InternetAddress(toEmail));
            msg.setSubject(subject);
            msg.setContent(body, "text/html; charset=UTF-8");

            Transport transport = session.getTransport();
            System.out.println(mailProperties.getSmtp().getHost());
            System.out.println(mailProperties.getSmtp().getUsername());
            System.out.println(mailProperties.getSmtp().getPassword());
            transport.connect(mailProperties.getSmtp().getHost(), mailProperties.getSmtp().getUsername(),
                    mailProperties.getSmtp().getPassword());
            transport.sendMessage(msg, msg.getAllRecipients());
            return true;
        } catch (Exception ex) {

            // Lgger.getLogger(this.getClass().getName()).log(Level.SEVERE, ex.getMessage(),
            // ex);
            subject = "";
            body = "";
            toEmail = "";
        }

        return false;
    }
}
