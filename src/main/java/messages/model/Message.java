package messages.model;

public class Message {
    private String id;
    private String subject;
    private String message;

    public Message() {
    }

    public Message(final String id, final String subject, final String message) {
        this.id = id;
        this.subject = subject;
        this.message = message;
    }

    public String getSubject() {
        return subject;
    }

    public void setSubject(String subject) {
        this.subject = subject;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }
}
