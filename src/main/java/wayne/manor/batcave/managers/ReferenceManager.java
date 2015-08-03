package mil.army.logsa.reference.managers;

import java.util.List;
import mil.army.logsa.reference.dao.ReferenceDao;
import mil.army.logsa.reference.model.AuthorizationCode;
import mil.army.logsa.reference.model.Branch;
import mil.army.logsa.reference.model.CommandAssignmentCode;
import mil.army.logsa.reference.model.ComponentCode;
import mil.army.logsa.reference.model.Macom;
import mil.army.logsa.reference.model.LocationCode;
import mil.army.logsa.reference.model.UnitNumber;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

/**
 *
 * @author joshua.s.davidson1
 */
@Component
public class ReferenceManager {
    @Autowired
    private ReferenceDao referenceDao;

    public List<AuthorizationCode> getAuthorizationCodes() {
        return referenceDao.getAuthorizationCodes();
    }

    public List<Branch> getBranches() {
        return referenceDao.getBranches();
    }

    public List<CommandAssignmentCode> getCommandAssignmentCodes() {
        return referenceDao.getCommandAssignmentCodes();
    }

    public List<ComponentCode> getComponentCodes() {
        return referenceDao.getComponentCodes();
    }

    public List<LocationCode> getLocationCodes() {
        return referenceDao.getLocationCodes();
    }

    public List<Macom> getMacoms() {
        return referenceDao.getMacoms();
    }
    
    public List<UnitNumber> getUnitNumbers() {
        return referenceDao.getUnitNumbers();
    }
}
