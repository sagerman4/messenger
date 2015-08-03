package mil.army.logsa.reference.dao;

import com.google.common.collect.Lists;
import java.util.Collection;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.core.simple.SimpleJdbcCall;
import org.springframework.stereotype.Component;

/**
 *
 * @author joshua.s.davidson1
 */
@Component
public class ReferenceProcedureExecutor {
    
    @Autowired
    private ReferenceProcedureProvider referenceProcedureProvider;
    
    <T> List<T> execute(final RowMapper<T> rowMapper, final int refTypeCode)
    {
        final SimpleJdbcCall call = referenceProcedureProvider.getReferenceProcedure(rowMapper);
        final Map<String, Object> params=new HashMap<>();
        params.put("p_ref_type", refTypeCode);
        return Lists.newArrayList(((Collection<T>)call.execute(params).get("p_Result")).iterator());
    }
}
