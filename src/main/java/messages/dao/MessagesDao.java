package mil.army.logsa.reference.dao;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;
import mil.army.logsa.reference.commmon.ReferenceType;
import mil.army.logsa.reference.model.AuthorizationCode;
import mil.army.logsa.reference.model.Branch;
import mil.army.logsa.reference.model.CommandAssignmentCode;
import mil.army.logsa.reference.model.ComponentCode;
import mil.army.logsa.reference.model.LocationCode;
import mil.army.logsa.reference.model.Macom;
import mil.army.logsa.reference.commmon.ReferenceDatumFactory;
import mil.army.logsa.reference.model.UnitNumber;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Component;

/**
 *
 * @author joshua.s.davidson1
 */
@Component
public class ReferenceDao {
    @Autowired
    private ReferenceProcedureExecutor executor;
    
    public List<AuthorizationCode> getAuthorizationCodes() {
        return executor.execute(
                new DefaultReferenceMapper<>(
                        new ReferenceDatumFactory<AuthorizationCode>() {
                            @Override
                            public AuthorizationCode create(String key, String description) {
                                return new AuthorizationCode(key, description);
                            }
                        }
                ), ReferenceType.AUTHORIZATION.getCode());
    }

    public List<Branch> getBranches() {
        return executor.execute(
                new DefaultReferenceMapper<>(
                        new ReferenceDatumFactory<Branch>() {
                            @Override
                            public Branch create(String key, String description) {
                                return new Branch(key, description);
                            }
                        }
                ), ReferenceType.BRANCH.getCode());
    }
    
    public List<CommandAssignmentCode> getCommandAssignmentCodes() {
        return executor.execute(
                new DefaultReferenceMapper<>(
                        new ReferenceDatumFactory<CommandAssignmentCode>() {
                            @Override
                            public CommandAssignmentCode create(String key, String description) {
                                return new CommandAssignmentCode(key, description);
                            }
                        }
                ), ReferenceType.COMMAND_ASSIGNMENT.getCode());
    }
    
    public List<ComponentCode> getComponentCodes() {
        return executor.execute(
                new DefaultReferenceMapper<>(
                        new ReferenceDatumFactory<ComponentCode>() {
                            @Override
                            public ComponentCode create(String key, String description) {
                                return new ComponentCode(key, description);
                            }
                        }
                ), ReferenceType.COMPONENT.getCode());
    }
    
    public List<LocationCode> getLocationCodes() {
        return executor.execute(
                        new RowMapper<LocationCode>(){
                            @Override
                            public LocationCode mapRow(ResultSet rs, int i) throws SQLException {
                                return new LocationCode(rs.getString("key"), rs.getString("descr"), rs.getString("CONUS_OCONUS_FLG"));
                            }
                        }, ReferenceType.LOCATION.getCode());
    }
    
    public List<Macom> getMacoms() {
        return executor.execute(
                new DefaultReferenceMapper<>(
                        new ReferenceDatumFactory<Macom>() {
                            @Override
                            public Macom create(String key, String description) {
                                return new Macom(key, description);
                            }
                        }
                ), ReferenceType.MACOM.getCode());
    }
    
    public List<UnitNumber> getUnitNumbers() {
        return executor.execute(
                new DefaultReferenceMapper<>(
                        new ReferenceDatumFactory<UnitNumber>() {
                            @Override
                            public UnitNumber create(String key, String description) {
                                return new UnitNumber(key);
                            }
                        }
                ), ReferenceType.UNIT_NUMBER.getCode());
    }

}