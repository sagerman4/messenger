package mil.army.logsa.reference.rest;

import com.google.gson.Gson;
import java.util.List;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import mil.army.logsa.reference.managers.ReferenceManager;
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
/**
 *
 * @author jason.t.murphree
 */

@Path("reference")
@Component
public class ReferenceService {
       
    @Autowired
    private ReferenceManager referenceManager;
   
    @GET
    @Path("authorizationcodes")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getAuthorizationCodes(){
        List<AuthorizationCode> result = referenceManager.getAuthorizationCodes();
        return Response.ok(new Gson().toJson(result)).build();
    }
    
    @GET
    @Path("branches")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getBranches(){
        List<Branch> result = referenceManager.getBranches();
        return Response.ok(new Gson().toJson(result)).build();
    }
    
    @GET
    @Path("commandassigncodes")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getCommandAssignmentCodes(){
        List<CommandAssignmentCode> result = referenceManager.getCommandAssignmentCodes();
        return Response.ok(new Gson().toJson(result)).build();
    }
    
    @GET
    @Path("componentcodes")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getComponentCodes(){
        List<ComponentCode> result = referenceManager.getComponentCodes();
        return Response.ok(new Gson().toJson(result)).build();
    }
    
    @GET
    @Path("locations")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getStateAndCountryCodes(){
         List<LocationCode> result = referenceManager.getLocationCodes();
        return Response.ok(new Gson().toJson(result)).build();

    }
    
    @GET
    @Path("macoms")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getMacoms() {
       final List<Macom> result = referenceManager.getMacoms();
       return Response.ok(new Gson().toJson(result)).build();
       
    }
    
    @GET
    @Path("unitnumbers")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getUnitNumbers(){
        List<UnitNumber> result = referenceManager.getUnitNumbers();
        return Response.ok(new Gson().toJson(result)).build();
    }
    
//    @POST
//    @Path("geocodes")
//    @Produces(MediaType.APPLICATION_JSON)
//    public Response getGeoCodes(final String params){
//        final GeoCodesParams geoCodesParams = new Gson().fromJson(params, GeoCodesParams.class);
//        List<GeoCode> result = referenceManager.getGeoCodes(geoCodesParams.getStateCountryCodes());
//        return Response.ok(new Gson().toJson(result)).build();
//    }
}
