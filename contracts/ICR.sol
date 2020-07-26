pragma solidity >=0.4.22 <0.7.0;

import "./safemath.sol";
import "./ownable.sol";

contract ICR is Ownable{
    using SafeMath for uint256;

    event Transfer(address indexed _from, address indexed _to, uint256 indexed _value);
    event Approval(address indexed _owner, address indexed _approved, uint256 indexed _value);
    event NewUser(address indexed _uname);

    mapping (address => uint256) private _balances;

    mapping (address => mapping (address => uint256)) private _allowances;

    mapping (address => bool) private _users;

    uint256 private _totalSupply;

    string private _name;
    string private _symbol;
    uint8 private _decimals;

    constructor () public {
        _name = "IndianCryptoRupee";
        _symbol = "ICR";
    }

    modifier onlyUser(address _uname) {
        require(_users[_uname], "Not a Valid User");
        _;
    }

    function name() public view returns (string memory) {
        return _name;
    }

    function symbol() public view returns (string memory) {
        return _symbol;
    }

    function addUser(address _uname) public onlyOwner{
        _users[_uname] = true;
        emit NewUser(_uname);
    }

    function totalSupply() public view returns (uint256) {
        return _totalSupply;
    }

    function allowance(address owner, address spender) public view onlyUser(owner) onlyUser(spender) returns (uint256) {
        return _allowances[owner][spender];
    }

    function approve(address spender, uint256 amount) public onlyUser(spender) onlyUser(msg.sender) returns (bool) {
        _approve(msg.sender, spender, amount);
        return true;
    }

    /**
     * @dev converts fiat currency to token. (create token)
     */
    function mint(address account, uint256 amount) public onlyOwner onlyUser(account) {
        require(account != address(0), "ERC20: mint to the zero address");

        _totalSupply = _totalSupply.add(amount);
        _balances[account] = _balances[account].add(amount);
        emit Transfer(address(0), account, amount);
    }

    /**
     * @dev converts token to fiat currency. (burn token)
     */
    function burn(address account, uint256 amount) public onlyOwner onlyUser(account) {
        require(account != address(0), "ERC20: burn from the zero address");

        _balances[account] = _balances[account].sub(amount);
        _totalSupply = _totalSupply.sub(amount);
        emit Transfer(account, address(0), amount);
    }

    function balanceOf(address account) public view onlyUser(account) returns (uint256) {
        return _balances[account];
    }

    function transfer(address recipient, uint256 amount) public onlyUser(recipient) onlyUser(msg.sender) returns (bool) {
        _transfer(msg.sender, recipient, amount);
        return true;
    }

    function _transfer(address sender, address recipient, uint256 amount) internal onlyUser(recipient) onlyUser(sender) {
        require(sender != address(0), "ERC20: transfer from the zero address");
        require(recipient != address(0), "ERC20: transfer to the zero address");

        _balances[sender] = _balances[sender].sub(amount);
        _balances[recipient] = _balances[recipient].add(amount);
        emit Transfer(sender, recipient, amount);
    }

    function transferFrom(address sender, address recipient, uint256 amount) public onlyUser(recipient) onlyUser(sender) returns (bool) {
        _approve(sender, msg.sender, _allowances[sender][msg.sender].sub(amount));
        _transfer(sender, recipient, amount);
        return true;
    }

    function increaseAllowance(address spender, uint256 addedValue) public onlyUser(spender) onlyUser(msg.sender) returns (bool) {
        _approve(msg.sender, spender, _allowances[msg.sender][spender].add(addedValue));
        return true;
    }

    function decreaseAllowance(address spender, uint256 subtractedValue) public onlyUser(spender) onlyUser(msg.sender) returns (bool) {
        _approve(msg.sender, spender, _allowances[msg.sender][spender].sub(subtractedValue));
        return true;
    }

    function _approve(address owner, address spender, uint256 amount) internal onlyUser(spender) onlyUser(owner) {
        require(owner != address(0), "ERC20: approve from the zero address");
        require(spender != address(0), "ERC20: approve to the zero address");

        _allowances[owner][spender] = amount;
        emit Approval(owner, spender, amount);
    }

}