package mil.army.logsa.reference.dao;

import javax.sql.DataSource;
import oracle.jdbc.OracleTypes;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.core.SqlOutParameter;
import org.springframework.jdbc.core.SqlParameter;
import org.springframework.jdbc.core.simple.SimpleJdbcCall;
import org.springframework.jndi.JndiObjectFactoryBean;
import org.springframework.stereotype.Component;

/**
 *
 * @author joshua.s.davidson1
 */
@Component
public class ReferenceProcedureProvider<T> {
    @Autowired
    @Qualifier("dataSource")
    private JndiObjectFactoryBean dataSourceProvider;
    
    public SimpleJdbcCall getReferenceProcedure(final RowMapper<T> rowMapper) {
        return new SimpleJdbcCall((DataSource)dataSourceProvider.getObject()).withProcedureName("GetReferenceList").withCatalogName("FORCE_REFERENCE_LIST").declareParameters(
                new SqlParameter("p_ref_type", OracleTypes.INTEGER),
                new SqlOutParameter("p_Result", OracleTypes.CURSOR, rowMapper)
        );
    }
}
