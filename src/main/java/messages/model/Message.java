package messages.model;

public class Message {
    private String id;
    private String subject;
    private String body;

    public Message() {
    }

    public Message(final String id, final String subject, final String body) {
        this.id = id;
        this.subject = subject;
        this.body = body;
    }

    public String getSubject() {
        return subject;
    }

    public void setSubject(String subject) {
        this.subject = subject;
    }

    public String getBody() {
        return body;
    }

    public void setBody (String body) {
        this.body = body;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }
}
