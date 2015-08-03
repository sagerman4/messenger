package mil.army.logsa.reference.model;

/**
 *
 * @author jason.t.murphree
 */
public class CommandAssignmentCode {
    private String code;
    private String description;

    public CommandAssignmentCode() {
    }

    public CommandAssignmentCode(final String code, final String description) {
        this.code = code;
        this.description = description;
    }

    public String getCode() {
        return code;
    }

    public String getDescription() {
        return description;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public void setDescription(String description) {
        this.description = description;
    }

              
}
