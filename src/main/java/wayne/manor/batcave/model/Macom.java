package mil.army.logsa.reference.model;

/**
 *
 * @author joshua.s.davidson1
 */
public class Macom {
    private String macom;
    private String description;

    public Macom() {}

    public Macom(final String macom, final String description) {
        this.macom = macom;
        this.description = description;
    }

    public String getMacom() {
        return macom;
    }

    public void setMacom(final String macom) {
        this.macom = macom;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(final String description) {
        this.description = description;
    }
}
