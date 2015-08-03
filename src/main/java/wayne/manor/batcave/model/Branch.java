package wayne.manor.batcave.model;

/**
 *
 * @author jason.t.murphree
 */
public class Branch {
    private String code;
    private String description;

    public Branch() {
    }

    public Branch(String code, String description) {
        this.code = code;
        this.description = description;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getCode() {
        return code;
    }

    public String getDescription() {
        return description;
    }
    
    
}
