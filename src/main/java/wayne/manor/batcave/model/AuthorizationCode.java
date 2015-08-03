package mil.army.logsa.reference.model;

/**
 *
 * @author joshua.s.davidson1
 */
public class AuthorizationCode {
    private String typeCode;
    private String typeCodeDescription;
    
    public AuthorizationCode(String typeCode, String typeCodeDescription) {
        this.typeCode = typeCode;
        this.typeCodeDescription = typeCodeDescription;
    }
    
    public String getTypeCode() {
        return typeCode;
    }

    public void setTypeCode(String typeCode) {
        this.typeCode = typeCode;
    }

    public String getTypeCodeDescription() {
        return typeCodeDescription;
    }

    public void setTypeCodeDescription(String typeCodeDescription) {
        this.typeCodeDescription = typeCodeDescription;
    }
}
