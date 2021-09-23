
import Trie "mo:base/Trie";
import Hash "mo:base/Hash";
import Nat "mo:base/Nat";
import Text "mo:base/Text";
import Principal "mo:base/Principal";
import Result "mo:base/Result";//for better error handling
import Iter "mo:base/Iter";
import Option "mo:base/Option";

import Error "mo:base/Error";

shared({ caller = initializer }) actor class() {
    public type Error={//this is expected by result library and this is called variant
        #NotFound;
        
        #NotAuthorized;
        
    };

    // Establish role-based greetings to display
    public shared({ caller }) func greet(name : Text) : async Result.Result<Text,Error>{
        if (has_permission(caller, #assign_role)) {
            return #ok("Hello, " # name # ". You have a role with administrative privileges.");
        } else if (has_permission(caller, #lowest)) {
            return #ok("Welcome, " # name # ". You have an authorized account. Would you like to play a game?");
        } else {
            return #ok("Greetings, " # name # ". Nice to meet you!");
        }
    };

    // Define custom types
    public type Role = {
        #owner;
        #admin;
        #authorized;
        #unauthorized;
    };

    public type Permission = {
        #assign_role;
        #lowest;
    };

    type RoleFormatted ={
        name: Text;
        role :Role;
    };

    type rolesMap = {
        principal : Principal;
        name : Text;
        role : Role;
    };
    

    private stable var roles: Trie.Trie<Principal, RoleFormatted> = Trie.empty();
    private stable var role_requests: Trie.Trie<Principal, RoleFormatted> = Trie.empty();
    
    // func principal_eq(a: Principal, b: Principal): Bool {
    //     return a == b;
    // };

    func get_role(pal: Principal) : Role {
        if (pal == initializer) {
            #owner;
        } else {
            let roleObject = Trie.find(
                roles,
                keyPrincipal(pal),
                Principal.equal
            );
            switch(roleObject){
                case null {
                    return #unauthorized;
                };
                case (?v){
                    return v.role;
                }
            }
        }
    };

    // Determine if a principal has a role with permissions
    func has_permission(pal: Principal, perm : Permission) : Bool {
        let role = get_role(pal);
        switch (role, perm) {
            case (#owner or #admin, _) true;
            case (#authorized, #lowest) true;
            case (_, _) false;
        }
    };

    // Reject unauthorized user identities
    func require_permission(pal: Principal, perm: Permission) : async () {
        if ( has_permission(pal, perm) == false ) {
            throw Error.reject( "unauthorized" );
        }
    };

    // Assign a new role to a principal
    public shared({ caller }) func assign_role( assignee: Principal, new_role: Role,name:Text ) : async Result.Result<(),Error> {
        await require_permission( caller, #assign_role );

        switch new_role {
            case (#owner) {
                throw Error.reject( "Cannot assign anyone to be the owner" );
            };
            case (_) {};
        };
        if (assignee == initializer) {
            throw Error.reject( "Cannot assign a role to the canister owner" );
        };
        let entry:RoleFormatted = {
            name =  name;
             role = new_role;
        };
        roles := Trie.replace(
            roles,
             keyPrincipal(assignee),
             Principal.equal,
             ?entry).0;

            role_requests := Trie.replace(role_requests, 
            keyPrincipal(assignee),
            Principal.equal,
            null).0;

            #ok();
    };

    public  func request_role( role: Role,name:Text,caller:Principal ) : async Bool{
        let entry = {
            name = name;
            role = role;
        };
        role_requests := Trie.replace(role_requests,
        keyPrincipal(caller),
        Principal.equal,
        ?entry).0;
        return true;
    };

    // Return the principal of the message caller/user identity
    public shared({ caller }) func callerPrincipal() : async Result.Result<Principal,Error> {
        #ok(caller);
    };

    // Return the role of the message caller/user identity
    public  func my_role(main_caller:Principal) : async Result.Result<Role,Error>{
        // switch(get_role(main_caller)){
        //     case null {
        //         return "not authorized";
        //     };
        //     case (? v){
        //         return "authorized";
        //     }
        // };
        return #ok(get_role(main_caller));
    };

    public func get_owner(): async Result.Result<Principal,Error>{
        return #ok(initializer);
    };

    public shared({ caller }) func my_role_request() : async Result.Result<?RoleFormatted,Error> {
        let res=Trie.find(role_requests,
        keyPrincipal(caller),
        Principal.equal);
        switch(res){
            case null{
                #err(#NotFound);
            };
            case (?v){
                #ok(res)
            };
        };
    };

    public shared({ caller }) func get_role_requests() : async Result.Result<[rolesMap],Error> {
        await require_permission( caller, #assign_role );
        return #ok(Trie.toArray(role_requests,returnFormatter));
    };

    public shared({ caller }) func get_roles() : async Result.Result<[rolesMap],Error> {
        await require_permission( caller, #assign_role );
        return #ok(Trie.toArray(roles,returnFormatter));
    };


     private func keyPrincipal(x:Principal):Trie.Key<Principal>{
        return {key = x;hash=Principal.hash(x)}
    };

    private func returnFormatter(k:Principal,v:RoleFormatted):rolesMap{
        return {
            principal = k;
            name = v.name;
            role = v.role;
        };
    };

    // private func extractRoles(k:Principal,v:Role):Types.Task{
    //     return v;
    // };
    public func canAccess(caller:Principal) : async Bool {
        let role = get_role(caller);
        switch(role){
            case (#unauthorized){
                return false;
            };
            case (#authorized){
                return true;
            };
            case (#owner){
                return true;
            };
            case (#admin){
                return true;
            };
        };
        
        
    };

    public  func my_role_request_out(caller:Principal) : async Bool {
        let res=Trie.find(role_requests,
        keyPrincipal(caller),
        Principal.equal);
        switch(res){
            case null{
                return false;
            };
            case (?v){
                return true;
            };
        };
    };
};