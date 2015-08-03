package mil.army.logsa.reference.model;

/**
 *
 * @author joshua.s.davidson1
 */
public class GeoCode {
    private String code;
    private String name;

    public GeoCode() {
    }

    public GeoCode(final String code, final String name) {
        this.code = code;
        this.name = name;
    }

    public String getCode() {
        return code;
    }

    public void setCode(final String code) {
        this.code = code;
    }

    public String getName() {
        return name;
    }

    public void setName(final String name) {
        this.name = name;
    }
}
