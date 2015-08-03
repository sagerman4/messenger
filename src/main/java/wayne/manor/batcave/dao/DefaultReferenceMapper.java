package mil.army.logsa.reference.dao;

import java.sql.ResultSet;
import java.sql.SQLException;
import mil.army.logsa.reference.commmon.ReferenceDatumFactory;
import org.springframework.jdbc.core.RowMapper;

/**
 * This class will map the default values for reference data, "key" and "descr".
 * <p>
 * If you are mapping data that has more columns than this, then you need to 
 *    use another RowMapper type.
 * <p>
 * This mapper's constructor takes a ReferenceDatumFactory as a parameter, which
 *    basically allows the caller to pass in a constructor to be called.  This
 *    can be rewritten to be more concise using method references or lambda 
 *    expressions with Java 8.
 * 
 * @author joshua.s.davidson1
 */
public class DefaultReferenceMapper<T> implements RowMapper<T> {

    private final ReferenceDatumFactory<T> factory;
    
    public DefaultReferenceMapper(final ReferenceDatumFactory<T> factory){
        this.factory = factory;
    }
    
    @Override
    public T mapRow(final ResultSet rs, final int i) throws SQLException {
        return factory.create(rs.getString("key"), rs.getString("descr"));
    }
}
