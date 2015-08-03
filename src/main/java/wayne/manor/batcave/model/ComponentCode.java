package mil.army.logsa.reference.model;


/**
 *
 * @author jason.t.murphree
 */
public class ComponentCode {
    private String code;
    private String description;

    public ComponentCode() {
    }

    public ComponentCode(String code, String description) {
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
